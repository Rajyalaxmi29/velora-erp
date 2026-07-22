/**
 * Simple logger utility.
 * Wraps console with named levels and timestamps.
 * Can be swapped for Winston/Pino later without changing call sites.
 */
const timestamp = (): string => new Date().toISOString();

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.log(`[${timestamp()}] ℹ  INFO: ${message}`, ...args);
  },

  warn: (message: string, ...args: unknown[]) => {
    console.warn(`[${timestamp()}] ⚠  WARN: ${message}`, ...args);
  },

  error: (message: string, ...args: unknown[]) => {
    console.error(`[${timestamp()}] ❌ ERROR: ${message}`, ...args);
  },

  debug: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${timestamp()}] 🐛 DEBUG: ${message}`, ...args);
    }
  },

  success: (message: string, ...args: unknown[]) => {
    console.log(`[${timestamp()}] ✅ ${message}`, ...args);
  },
};
