/**
 * Core data types for the AWPL Helper application
 */

// User credentials and basic info
export interface User {
  id: string;
  pass: string;
  name: string;
}

// Level information with performance metrics
export interface LevelData extends User {
  level: string;
  sao?: number;
  sgo?: number;
}

// Target information with performance metrics
export interface TargetData extends User {
  level: string;
  sao?: number;
  sgo?: number;
}

// Cheque information with weekly data
export interface ChequeData extends User {
  level: string;
  data: Record<string, number>;
}

// Combined data structure
export interface AWPLData {
  level: LevelData[];
  target: TargetData[];
  cheque: ChequeData[];
}

// Function types supported by the application
export type FunctionType = 'LEVEL' | 'TARGET' | 'CHEQUE';

// Configuration options
export interface Config {
  debug: boolean;
  levelUrl: string;
  targetUrl: string;
  baseUrl: string;
  maxRetries: number;
  concurrency: number;
}

// Logger levels
export type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success'; 