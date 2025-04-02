import type { Browser, Page } from 'puppeteer';
import { getLoginUrl, LEVELS, TARGET_SAOS, TARGET_SGOS } from '../config';
import { Logger } from '../utils/logger';
import type { ChequeData, LevelData, TargetData, User } from '../types';
import axios from 'axios';

/**
 * Handles all puppeteer/web scraping operations
 */
export class ScraperService {
  private browser?: Browser;
  private pendingXHR: any;
  private retryDelay = 2000; // ms

  constructor(browser: Browser, pendingXHR: any) {
    this.browser = browser;
    this.pendingXHR = pendingXHR;
  }

  /**
   * Verify user credentials via API call
   */
  async verifyCredentials(id: string, pass: string): Promise<boolean> {
    try {
      const url = getLoginUrl(id, pass);
      const response = await axios.get(url);
      
      // Check for rate limiting message
      if (response.data.includes('Plz Try After some Time :')) {
        Logger.error('Rate limited by server. Please try again later.');
        return false;
      }
      
      // Check for alert message (login failed)
      if (response.data.includes('alert')) {
        return false;
      }
      
      return true;
    } catch (error) {
      Logger.error(`Network error during credential verification`, error as Error);
      return false;
    }
  }

  /**
   * Login to the website with user credentials
   */
  async login(page: Page, user: User): Promise<boolean> {
    try {
      // Handle alert dialogs (usually error messages)
      page.on('dialog', async (dialog) => {
        const alertText = dialog.message();
        await dialog.dismiss();
        Logger.warn(`Alert during login for ${user.id}: ${alertText}`);
        throw new Error(`Login failed: ${alertText}`);
      });

      // Navigate to login URL
      const url = getLoginUrl(user.id, user.pass);
      await page.goto(url, { waitUntil: 'networkidle2' });
      
      return true;
    } catch (error) {
      Logger.error(`Failed to login for user ${user.id}`, error as Error);
      return false;
    }
  }

  /**
   * Scrape level data for a user
   */
  async getLevelData(page: Page, user: User): Promise<LevelData | null> {
    try {
      // Navigate to level page
      await page.evaluate((levelUrl) => window.open(levelUrl, '_self'), process.env.LEVEL_URL);
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      
      // Extract SAO and SGO from page
      const sao = await page.evaluate(() => {
        const element = document.querySelector(
          '#ctl00_ContentPlaceHolder1_GVPanding > tbody > tr:nth-child(2) > td:nth-child(5)'
        );
        return element ? Number(element.textContent) : 0;
      });
      
      const sgo = await page.evaluate(() => {
        const element = document.querySelector(
          '#ctl00_ContentPlaceHolder1_GVPanding > tbody > tr:nth-child(2) > td:nth-child(6)'
        );
        return element ? Number(element.textContent) : 0;
      });
      
      // Calculate level based on SAO and SGO values
      const minIndex = Math.min(
        TARGET_SAOS.findIndex(targetSAO => sao < targetSAO),
        TARGET_SGOS.findIndex(targetSGO => sgo < targetSGO)
      );
      
      // Calculate pending SAO and SGO for next level
      const pendingSAO = Math.round(
        minIndex === -1 ? 0 : Math.max(0, TARGET_SAOS[minIndex] - sao)
      );
      
      const pendingSGO = Math.round(
        minIndex === -1 ? 0 : Math.max(0, TARGET_SGOS[minIndex] - sgo)
      );
      
      // Get current level
      const level = minIndex === -1 ? LEVELS[LEVELS.length - 1] : LEVELS[minIndex];
      
      return {
        ...user,
        level,
        sao: pendingSAO,
        sgo: pendingSGO
      };
    } catch (error) {
      Logger.error(`Failed to get level data for user ${user.id}`, error as Error);
      return null;
    }
  }

  /**
   * Scrape target data for a user
   */
  async getTargetData(page: Page, user: User): Promise<TargetData | null> {
    try {
      // Initialize the PendingXHR for this page instance
      const pending = new this.pendingXHR(page);
      
      // Navigate to target page
      await page.evaluate((targetUrl) => window.open(targetUrl, '_self'), process.env.TARGET_URL);
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      
      // Wait for all XHR requests to finish
      await pending.waitForAllXhrFinished();
      
      // Check if user has DS
      const noDs = await page.evaluate(() => {
        const element = document.querySelector('#ctl00_ContentPlaceHolder1_lblMsg');
        return element ? element.textContent : null;
      });
      
      if (noDs !== null) {
        return {
          ...user,
          level: 'No DS',
          sao: 0,
          sgo: 0
        };
      }
      
      // Extract level information
      const level = await page.evaluate(() => {
        const element = document.querySelector(
          '#ctl00_ContentPlaceHolder1_CustomersGridView > tbody > tr:nth-child(2) > td:nth-child(2)'
        );
        return element ? element.textContent?.replace(' DS', '') || 'Unknown' : 'Unknown';
      });
      
      // Extract SAO information
      const pendingSao = await page.evaluate(() => {
        const element = document.querySelector(
          '#ctl00_ContentPlaceHolder1_CustomersGridView > tbody > tr:nth-child(2) > td:nth-child(5)'
        );
        return element ? Number(element.textContent) : 0;
      });
      
      // Extract SGO information
      const pendingSgo = await page.evaluate(() => {
        const element = document.querySelector(
          '#ctl00_ContentPlaceHolder1_CustomersGridView > tbody > tr:nth-child(2) > td:nth-child(6)'
        );
        return element ? Number(element.textContent) : 0;
      });
      
      return {
        ...user,
        level,
        sao: pendingSao,
        sgo: pendingSgo
      };
    } catch (error) {
      Logger.error(`Failed to get target data for user ${user.id}`, error as Error);
      return null;
    }
  }

  /**
   * Scrape cheque data for a user
   */
  async getChequeData(page: Page, user: User): Promise<ChequeData | null> {
    try {
      // Navigate to cheque page (assuming it exists in the environment variables)
      await page.evaluate((chequeUrl) => window.open(chequeUrl, '_self'), process.env.CHEQUE_URL);
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      
      // Extract dates and values from the table
      const chequeData = await page.evaluate(() => {
        const data: Record<string, number> = {};
        
        // Get table rows
        const rows = document.querySelectorAll('#ctl00_ContentPlaceHolder1_GVPanding > tbody > tr');
        if (rows.length <= 1) {
          return data;
        }
        
        // Process each row (skip header)
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          const dateCell = row.querySelector('td:nth-child(2)');
          const valueCell = row.querySelector('td:nth-child(3)');
          
          if (dateCell && valueCell) {
            const date = dateCell.textContent?.trim() || '';
            const value = parseFloat(valueCell.textContent?.trim() || '0');
            
            if (date) {
              data[date] = value;
            }
          }
        }
        
        return data;
      });
      
      // Extract level information
      const level = await page.evaluate(() => {
        const element = document.querySelector('#ctl00_ContentPlaceHolder1_lbllevel');
        return element ? element.textContent?.trim() || 'Unknown' : 'Unknown';
      });
      
      return {
        ...user,
        level,
        data: chequeData
      };
    } catch (error) {
      Logger.error(`Failed to get cheque data for user ${user.id}`, error as Error);
      return null;
    }
  }
} 