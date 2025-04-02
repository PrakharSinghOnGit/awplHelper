import chalk from 'chalk';
import type { LogLevel } from '../types';
import { config } from '../config';

/**
 * Logger class for standardized logging with color formatting
 */
export class Logger {
  private static getPrefix(level: LogLevel): string {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
    
    switch (level) {
      case 'info':
        return chalk.blue(`[${timestamp}] INFO: `);
      case 'warn':
        return chalk.yellow(`[${timestamp}] WARN: `);
      case 'error':
        return chalk.red(`[${timestamp}] ERROR: `);
      case 'debug':
        return chalk.magenta(`[${timestamp}] DEBUG: `);
      case 'success':
        return chalk.green(`[${timestamp}] SUCCESS: `);
      default:
        return chalk.white(`[${timestamp}]: `);
    }
  }

  /**
   * Log an informational message
   */
  static info(message: string): void {
    console.log(this.getPrefix('info') + message);
  }

  /**
   * Log a warning message
   */
  static warn(message: string): void {
    console.log(this.getPrefix('warn') + message);
  }

  /**
   * Log an error message with optional error object
   */
  static error(message: string, error?: Error): void {
    console.error(this.getPrefix('error') + message);
    if (error && config.debug) {
      console.error(chalk.red(error.stack || error.message));
    }
  }

  /**
   * Log a debug message (only shown when debug mode is enabled)
   */
  static debug(message: string): void {
    if (config.debug) {
      console.log(this.getPrefix('debug') + message);
    }
  }

  /**
   * Log a success message
   */
  static success(message: string): void {
    console.log(this.getPrefix('success') + message);
  }

  /**
   * Create a divider line
   */
  static divider(): void {
    console.log(chalk.dim('-'.repeat(process.stdout.columns || 80)));
  }

  /**
   * Format text as padded with specified color
   */
  static formatPadded(text: string, length: number, color: (text: string) => string): string {
    return text.length < length 
      ? color(text) + ' '.repeat(length - text.length) 
      : color(text.substring(0, length));
  }
} 