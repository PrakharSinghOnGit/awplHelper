import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Cluster } from 'puppeteer-cluster';
import { PendingXHR } from 'pending-xhr-puppeteer';
import path from 'path';

import { config } from '../config';
import { Logger } from '../utils/logger';
import { ScraperService } from '../services/scraper';
import { FileUtils } from '../utils/file';
import { UI } from '../utils/ui';
import type { AWPLData, FunctionType, User } from '../types';

// Declare chromium module
const chromium = require('chromium');

// Apply stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

/**
 * Core mining class that orchestrates the web scraping process
 */
export class Miner {
  private dataDir: string;
  private jsonDir: string;
  private outputDir: string;
  private cluster?: Cluster;
  private results: AWPLData = { level: [], target: [], cheque: [] };
  private teamName: string = '';
  private startTime: number = 0;
  
  constructor(
    dataDir: string = path.join(process.cwd(), 'data'),
    jsonDir: string = path.join(process.cwd(), 'json'),
    outputDir: string = path.join(process.cwd(), 'out')
  ) {
    this.dataDir = dataDir;
    this.jsonDir = jsonDir;
    this.outputDir = outputDir;
    
    // Ensure directories exist
    FileUtils.ensureDirectoryExists(this.dataDir);
    FileUtils.ensureDirectoryExists(this.jsonDir);
    FileUtils.ensureDirectoryExists(this.outputDir);
    
    // Handle process termination
    process.on('SIGINT', this.handleTermination.bind(this));
  }
  
  /**
   * Initialize the Puppeteer cluster
   */
  private async initCluster(): Promise<void> {
    try {
      this.cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: config.concurrency,
        puppeteerOptions: {
          executablePath: chromium.path,
          headless: true, // Use boolean instead of string
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
          ],
        },
        monitor: config.debug,
        timeout: 180000, // 3 minutes
      });
      
      this.cluster.on('taskerror', (err, data) => {
        const user = data.user as User;
        Logger.error(`Error processing user: ${user.id} (${user.name})`, err);
      });
      
      Logger.debug('Puppeteer cluster initialized');
    } catch (error) {
      Logger.error('Failed to initialize Puppeteer cluster', error as Error);
      throw error;
    }
  }
  
  /**
   * Handle process termination
   */
  private async handleTermination(): Promise<void> {
    Logger.warn('Process interrupted by user');
    await this.shutdown();
    process.exit(0);
  }
  
  /**
   * Shutdown the Puppeteer cluster
   */
  private async shutdown(): Promise<void> {
    try {
      if (this.cluster) {
        await this.cluster.idle();
        await this.cluster.close();
        Logger.debug('Puppeteer cluster closed');
      }
    } catch (error) {
      Logger.error('Error during shutdown', error as Error);
    }
  }
  
  /**
   * Save progress to JSON file
   */
  private saveProgress(): void {
    const filePath = path.join(this.jsonDir, `${this.teamName}.json`);
    FileUtils.saveJsonData(filePath, this.results);
  }
  
  /**
   * Mine user data based on selected functions
   */
  async mine(teamName: string, users: User[], functions: FunctionType[]): Promise<AWPLData> {
    this.startTime = Date.now();
    this.teamName = teamName;
    this.results = { level: [], target: [], cheque: [] };
    
    Logger.info(`Starting mining for ${users.length} users with functions: ${functions.join(', ')}`);
    
    // Initialize the cluster
    await this.initCluster();
    
    if (!this.cluster) {
      throw new Error('Cluster failed to initialize');
    }
    
    // Process each user
    for (const user of users) {
      await this.cluster.execute({ user, functions }, async ({ page, data: { user, functions } }) => {
        // Create a scraper service for this page
        const scraper = new ScraperService(page.browser(), PendingXHR);
        
        // Verify credentials and login
        const isValid = await scraper.verifyCredentials(user.id, user.pass);
        if (!isValid) {
          Logger.warn(`Invalid credentials for user: ${user.id} (${user.name})`);
          return;
        }
        
        // Login to the website
        const loggedIn = await scraper.login(page, user);
        if (!loggedIn) {
          Logger.warn(`Failed to login for user: ${user.id} (${user.name})`);
          return;
        }
        
        // Process each selected function
        for (const func of functions) {
          try {
            switch (func) {
              case 'LEVEL':
                const levelData = await scraper.getLevelData(page, user);
                if (levelData) {
                  this.results.level.push(levelData);
                  Logger.debug(`Retrieved level data for ${user.id} (${user.name}): ${levelData.level}`);
                }
                break;
                
              case 'TARGET':
                const targetData = await scraper.getTargetData(page, user);
                if (targetData) {
                  this.results.target.push(targetData);
                  Logger.debug(`Retrieved target data for ${user.id} (${user.name}): ${targetData.level}`);
                }
                break;
                
              case 'CHEQUE':
                const chequeData = await scraper.getChequeData(page, user);
                if (chequeData) {
                  this.results.cheque.push(chequeData);
                  Logger.debug(`Retrieved cheque data for ${user.id} (${user.name})`);
                }
                break;
            }
          } catch (error) {
            Logger.error(`Error processing ${func} for user ${user.id}`, error as Error);
          }
        }
        
        // Save progress after each user
        this.saveProgress();
      });
    }
    
    // Wait for all tasks to complete
    await this.cluster.idle();
    
    // Merge level data into cheque data if both are present
    if (functions.includes('LEVEL') && functions.includes('CHEQUE')) {
      this.mergeLevelDataIntoChequeData();
    }
    
    // Final save
    this.saveProgress();
    
    // Close the cluster
    await this.shutdown();
    
    const duration = UI.getFormattedTime(this.startTime);
    Logger.success(`Mining completed for team ${teamName} in ${duration}`);
    
    return this.results;
  }
  
  /**
   * Merge level data into cheque data for a complete report
   */
  private mergeLevelDataIntoChequeData(): void {
    this.results.cheque.forEach(chequeItem => {
      const matchingLevel = this.results.level.find(
        levelItem => levelItem.id === chequeItem.id
      );
      
      if (matchingLevel) {
        chequeItem.level = matchingLevel.level;
      }
    });
  }
} 