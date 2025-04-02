import fs from 'fs';
import path from 'path';
import { Logger } from './logger';
import type { User } from '../types';

/**
 * Utilities for file operations
 */
export class FileUtils {
  /**
   * Ensure a directory exists, creating it if necessary
   */
  static ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      Logger.debug(`Created directory: ${dirPath}`);
    }
  }

  /**
   * Read a CSV file containing user data and convert it to JSON
   */
  static readCsvToUsers(filePath: string): User[] {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const csvContent = fs.readFileSync(filePath, 'utf-8');
      return this.parseCsvToUsers(csvContent);
    } catch (error) {
      Logger.error(`Failed to read CSV file: ${filePath}`, error as Error);
      return [];
    }
  }

  /**
   * Parse CSV content to User objects
   */
  static parseCsvToUsers(csvContent: string): User[] {
    const lines = csvContent.replaceAll('\r', '').split('\n');
    if (lines.length < 2) {
      return [];
    }

    const headers = lines[0].split(',');
    const requiredFields = ['id', 'pass', 'name'];
    
    // Validate if CSV has required fields
    const missingFields = requiredFields.filter(field => !headers.includes(field));
    if (missingFields.length > 0) {
      Logger.error(`CSV is missing required fields: ${missingFields.join(', ')}`);
      return [];
    }

    const users: User[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      // Skip empty lines and commented lines
      if (!lines[i] || lines[i].trim() === '' || lines[i].startsWith('!')) {
        continue;
      }
      
      const values = lines[i].split(',');
      if (values.length !== headers.length) {
        Logger.warn(`Line ${i + 1} has incorrect number of fields, skipping`);
        continue;
      }
      
      // Create user object from CSV line
      const user: Record<string, string> = {};
      for (let j = 0; j < headers.length; j++) {
        const field = headers[j].trim();
        user[field] = values[j].trim().toUpperCase();
      }
      
      // Validate required fields exist
      const isValid = requiredFields.every(field => Boolean(user[field]));
      if (isValid) {
        users.push({
          id: user.id,
          pass: user.pass,
          name: user.name
        });
      } else {
        Logger.warn(`Line ${i + 1} is missing required fields, skipping`);
      }
    }
    
    return users;
  }

  /**
   * Save data to a JSON file
   */
  static saveJsonData<T>(filePath: string, data: T): boolean {
    try {
      this.ensureDirectoryExists(path.dirname(filePath));
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      Logger.debug(`Data saved to: ${filePath}`);
      return true;
    } catch (error) {
      Logger.error(`Failed to save JSON data to: ${filePath}`, error as Error);
      return false;
    }
  }

  /**
   * Read data from a JSON file
   */
  static readJsonData<T>(filePath: string): T | null {
    try {
      if (!fs.existsSync(filePath)) {
        Logger.warn(`JSON file not found: ${filePath}`);
        return null;
      }
      
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as T;
    } catch (error) {
      Logger.error(`Failed to read JSON data from: ${filePath}`, error as Error);
      return null;
    }
  }

  /**
   * Get all team names from data directory
   */
  static getTeamNames(dataDir: string): string[] {
    try {
      if (!fs.existsSync(dataDir)) {
        Logger.warn(`Data directory not found: ${dataDir}`);
        return [];
      }
      
      return fs.readdirSync(dataDir)
        .filter(file => file.endsWith('.csv'))
        .map(file => path.basename(file, '.csv'));
    } catch (error) {
      Logger.error(`Failed to read team names from: ${dataDir}`, error as Error);
      return [];
    }
  }

  /**
   * Clear files in a directory
   */
  static clearDirectory(dirPath: string): boolean {
    try {
      if (!fs.existsSync(dirPath)) {
        this.ensureDirectoryExists(dirPath);
        return true;
      }
      
      const files = fs.readdirSync(dirPath);
      for (const file of files) {
        fs.unlinkSync(path.join(dirPath, file));
      }
      
      Logger.debug(`Cleared directory: ${dirPath}`);
      return true;
    } catch (error) {
      Logger.error(`Failed to clear directory: ${dirPath}`, error as Error);
      return false;
    }
  }
} 