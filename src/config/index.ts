import type { Config } from '../types';

// Load environment variables from .env file if available
const env = process.env;

// Define the levels and target values
export const LEVELS = [
  'Fresher',
  'Bronze',
  'Silver',
  'Gold',
  'Platinum',
  'Emerald',
  'Topaz',
  'Ruby Star',
  'Sapphire',
  'Star Sapphire',
  'Diamond',
  'Blue Diamond',
  'Black Diamond',
  'Royal Diamond',
  'Crown Diamond',
  'Ambassador',
  'Royal Ambassador',
  'Crown Ambassador',
  'Brand Ambassador',
];

export const TARGET_SAOS = [
  200, 800, 2000, 4400, 9200, 21200, 45200, 93200, 189200,
  381200, 765200, 1533200, 3069200, 6141200, 12285200,
  24573200, 49149200, 98301200,
];

export const TARGET_SGOS = [
  100, 400, 1000, 2200, 4600, 10600, 22600, 46600, 94600,
  190600, 382600, 766600, 1534600, 3070600, 6142600,
  12286600, 24574600, 49150600,
];

// Create configuration from environment variables with defaults
export const config: Config = {
  debug: env.DEBUG?.toLowerCase() === 'true',
  levelUrl: env.LEVEL_URL || 'https://asclepiuswellness.com/userpanel/level/',
  targetUrl: env.TARGET_URL || 'https://asclepiuswellness.com/userpanel/target/',
  baseUrl: env.BASE_URL || 'https://asclepiuswellness.com/userpanel/uservalidationnew.aspx',
  maxRetries: parseInt(env.MAX_RETRIES || '3', 10),
  concurrency: parseInt(env.CONCURRENCY || '5', 10),
};

// Function to generate the login URL
export function getLoginUrl(id: string, pass: string): string {
  // Remove non-alphanumeric characters for safety
  const cleanId = id.replace(/\W/g, '');
  const cleanPass = pass.replace(/\W/g, '');
  return `${config.baseUrl}?memberid=${cleanId}&pwd=${cleanPass}`;
} 