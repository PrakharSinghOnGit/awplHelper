import { promisify } from 'util';
import { exec } from 'child_process';
import chalk from 'chalk';
import { FileUtils } from './file';
import path from 'path';
import { Logger } from './logger';
import type { FunctionType, User } from '../types';

// Third-party UI libraries for prompts
let Enquirer: any;
try {
  Enquirer = require('enquirer');
} catch (error) {
  Logger.error('Failed to load Enquirer. Terminal UI features will be limited.', error as Error);
}

const execAsync = promisify(exec);

/**
 * UI utilities for interactive CLI
 */
export class UI {
  /**
   * Create a selection prompt for teams
   */
  static async selectTeams(dataDir: string): Promise<string[]> {
    const teams = FileUtils.getTeamNames(dataDir);
    
    if (!teams.length) {
      Logger.error(`No team data found in ${dataDir}. Please add CSV files.`);
      process.exit(1);
    }
    
    if (!Enquirer) {
      Logger.warn('Enquirer not available. Defaulting to first team');
      return [teams[0]];
    }
    
    try {
      const prompt = new Enquirer.MultiSelect({
        name: 'teams',
        message: 'Select teams to process:',
        choices: teams,
      });
      
      const selectedTeams = await prompt.run();
      if (!selectedTeams || !selectedTeams.length) {
        Logger.warn('No teams selected');
        return [];
      }
      
      return selectedTeams;
    } catch (error) {
      Logger.error('Failed to select teams', error as Error);
      return [];
    }
  }
  
  /**
   * Create a selection prompt for functions
   */
  static async selectFunctions(): Promise<FunctionType[]> {
    if (!Enquirer) {
      Logger.warn('Enquirer not available. Defaulting to all functions');
      return ['LEVEL', 'TARGET', 'CHEQUE'];
    }
    
    try {
      const prompt = new Enquirer.MultiSelect({
        name: 'functions',
        message: 'Select functions to execute:',
        choices: [
          { name: 'LEVEL', value: 'LEVEL' },
          { name: 'TARGET', value: 'TARGET' },
          { name: 'CHEQUE', value: 'CHEQUE' },
        ],
      });
      
      const selectedFunctions = await prompt.run();
      if (!selectedFunctions || !selectedFunctions.length) {
        Logger.warn('No functions selected');
        return [];
      }
      
      return selectedFunctions as FunctionType[];
    } catch (error) {
      Logger.error('Failed to select functions', error as Error);
      return [];
    }
  }
  
  /**
   * Create a confirmation prompt
   */
  static async confirm(message: string): Promise<boolean> {
    if (!Enquirer) {
      Logger.warn('Enquirer not available. Defaulting to yes');
      return true;
    }
    
    try {
      const prompt = new Enquirer.Confirm({
        name: 'confirm',
        message,
      });
      
      return await prompt.run();
    } catch (error) {
      Logger.error('Failed to get confirmation', error as Error);
      return false;
    }
  }
  
  /**
   * Display a team data loading message
   */
  static displayTeamInfo(teamName: string, users: User[]): void {
    Logger.divider();
    Logger.info(`${chalk.bold.white('Mining for Team')}: ${chalk.yellow.bold(teamName)} (${chalk.green.bold(users.length)} users)`);
    Logger.divider();
  }
  
  /**
   * Get a formatted timestamp
   */
  static getFormattedTime(startTime: number): string {
    const endTime = Date.now();
    const timeTaken = endTime - startTime;
    
    const hours = Math.floor(timeTaken / 3600000);
    const minutes = Math.floor((timeTaken % 3600000) / 60000);
    const seconds = Math.floor((timeTaken % 60000) / 1000);
    const milliseconds = timeTaken % 1000;
    
    return `${hours}h ${minutes}m ${seconds}s ${milliseconds}ms`;
  }
  
  /**
   * Open the output directory
   */
  static async openOutputDirectory(outputDir: string): Promise<void> {
    try {
      FileUtils.ensureDirectoryExists(outputDir);
      
      // Cross-platform command to open a directory
      const command = process.platform === 'win32'
        ? `start "" "${outputDir}"`
        : process.platform === 'darwin'
          ? `open "${outputDir}"`
          : `xdg-open "${outputDir}"`;
      
      await execAsync(command);
      Logger.success(`Opened output directory: ${outputDir}`);
    } catch (error) {
      Logger.error(`Failed to open output directory: ${outputDir}`, error as Error);
    }
  }
} 