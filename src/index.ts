#!/usr/bin/env bun
import { Command } from 'commander';
import chalk from 'chalk';
import { AppController } from './controllers/app-controller';
import { Logger } from './utils/logger';
import { UI } from './utils/ui';

// Record the start time for performance tracking
const startTime = Date.now();

// Create the app controller
const app = new AppController();

// Create the CLI program
const program = new Command();

program
  .name('awpl')
  .version('1.0.0')
  .description('AWPL Helper - A tool for mining and visualizing AWPL data');

// Command to start the mining process
program
  .command('start')
  .description('Start the AWPL mining process')
  .action(async () => {
    try {
      await app.start();
      Logger.success(`Total time: ${UI.getFormattedTime(startTime)}`);
    } catch (error) {
      Logger.error('Error in start command', error as Error);
      process.exit(1);
    }
  });

// Command to print reports for existing data
program
  .command('print')
  .description('Generate HTML reports from existing data')
  .action(async () => {
    try {
      await app.printReports();
    } catch (error) {
      Logger.error('Error in print command', error as Error);
      process.exit(1);
    }
  });

// Command to clear all output directories
program
  .command('clear')
  .description('Clear all output directories')
  .action(() => {
    try {
      app.clearOutput();
    } catch (error) {
      Logger.error('Error in clear command', error as Error);
      process.exit(1);
    }
  });

// Command to open the output directory
program
  .command('out')
  .description('Open the output directory')
  .action(async () => {
    try {
      await app.openOutputDirectory();
    } catch (error) {
      Logger.error('Error in out command', error as Error);
      process.exit(1);
    }
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  Logger.error('Unhandled Promise Rejection', reason as Error);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  Logger.error('Uncaught Exception', error);
  process.exit(1);
});

// Parse the command line arguments
program.parse(process.argv); 