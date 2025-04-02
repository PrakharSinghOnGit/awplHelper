import path from 'path';
import { Miner } from '../core/miner';
import { HTMLGenerator } from '../services/html-generator';
import { FileUtils } from '../utils/file';
import { Logger } from '../utils/logger';
import { UI } from '../utils/ui';
import type { AWPLData, FunctionType } from '../types';

/**
 * Main application controller that coordinates the mining and report generation
 */
export class AppController {
  private dataDir: string;
  private jsonDir: string;
  private outputDir: string;
  private miner: Miner;
  
  constructor(
    dataDir: string = path.join(process.cwd(), 'data'),
    jsonDir: string = path.join(process.cwd(), 'json'),
    outputDir: string = path.join(process.cwd(), 'out')
  ) {
    this.dataDir = dataDir;
    this.jsonDir = jsonDir;
    this.outputDir = outputDir;
    
    // Initialize the miner
    this.miner = new Miner(this.dataDir, this.jsonDir, this.outputDir);
  }
  
  /**
   * Start the mining process
   */
  async start(): Promise<void> {
    try {
      // Get selected teams
      const selectedTeams = await UI.selectTeams(this.dataDir);
      if (!selectedTeams.length) {
        Logger.error('No teams selected. Exiting...');
        return;
      }
      
      // Get selected functions
      const selectedFunctions = await UI.selectFunctions();
      if (!selectedFunctions.length) {
        Logger.error('No functions selected. Exiting...');
        return;
      }
      
      // Process each team
      for (const teamName of selectedTeams) {
        // Load team data
        const teamDataPath = path.join(this.dataDir, `${teamName}.csv`);
        const users = FileUtils.readCsvToUsers(teamDataPath);
        
        if (!users.length) {
          Logger.error(`No valid user data found for team: ${teamName}`);
          continue;
        }
        
        // Display team info
        UI.displayTeamInfo(teamName, users);
        
        // Mine data
        const data = await this.miner.mine(teamName, users, selectedFunctions);
        
        // Generate and save HTML report
        if (!this.saveReports(teamName, data)) {
          Logger.error(`Failed to save reports for team: ${teamName}`);
        }
      }
      
      Logger.success('Mining process completed successfully');
    } catch (error) {
      Logger.error('Error during mining process', error as Error);
    }
  }
  
  /**
   * Generate and save reports for a team
   */
  private saveReports(teamName: string, data: AWPLData): boolean {
    try {
      // Save JSON data
      const jsonPath = path.join(this.jsonDir, `${teamName}.json`);
      FileUtils.saveJsonData(jsonPath, data);
      
      // Generate and save HTML report
      HTMLGenerator.saveHtmlReport(teamName, data, this.outputDir);
      
      return true;
    } catch (error) {
      Logger.error(`Failed to save reports for team: ${teamName}`, error as Error);
      return false;
    }
  }
  
  /**
   * Clear output directories
   */
  clearOutput(): boolean {
    try {
      // Clear JSON directory
      if (!FileUtils.clearDirectory(this.jsonDir)) {
        Logger.error('Failed to clear JSON directory');
        return false;
      }
      
      // Clear output directory
      if (!FileUtils.clearDirectory(this.outputDir)) {
        Logger.error('Failed to clear output directory');
        return false;
      }
      
      Logger.success('Output directories cleared successfully');
      return true;
    } catch (error) {
      Logger.error('Error clearing output directories', error as Error);
      return false;
    }
  }
  
  /**
   * Open the output directory
   */
  async openOutputDirectory(): Promise<void> {
    await UI.openOutputDirectory(this.outputDir);
  }
  
  /**
   * Print reports for selected teams
   */
  async printReports(): Promise<void> {
    try {
      // Get available teams from JSON files
      const teams = FileUtils.getTeamNames(this.jsonDir).map(team => 
        team.replace('.json', '')
      );
      
      if (!teams.length) {
        Logger.error('No team data found. Please run mining first.');
        return;
      }
      
      // Let user select teams to print
      const selectedTeams = await UI.selectTeams(this.jsonDir);
      if (!selectedTeams.length) {
        Logger.error('No teams selected for printing');
        return;
      }
      
      // Generate HTML reports for each selected team
      for (const teamName of selectedTeams) {
        const jsonPath = path.join(this.jsonDir, `${teamName}.json`);
        const data = FileUtils.readJsonData<AWPLData>(jsonPath);
        
        if (!data) {
          Logger.error(`No data found for team: ${teamName}`);
          continue;
        }
        
        // Generate and save HTML report
        HTMLGenerator.saveHtmlReport(teamName, data, this.outputDir);
      }
      
      Logger.success('Reports printed successfully');
    } catch (error) {
      Logger.error('Error printing reports', error as Error);
    }
  }
} 