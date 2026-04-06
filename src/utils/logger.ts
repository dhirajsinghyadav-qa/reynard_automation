import winston from 'winston';
import path from 'path';
import fs from 'fs';

// ─────────────────────────────────────────────────────────────
// Logger — Per spec file + per browser alag log file
// Format: logs/{specFileName}_{browserName}_{timestamp}.log
// ─────────────────────────────────────────────────────────────

const logsDir = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// ── In-memory log store ──
type LogEntry = {
  level: 'info' | 'warn' | 'error';
  testName: string;
  message: string;
  time: string;
};

// ── Per spec+browser key — log buffer ──
const logBuffer: Map<string, LogEntry[]> = new Map();

// ── Per spec+browser key — winston logger cache ──
const loggerCache: Map<string, winston.Logger> = new Map();

// ── Global state ──
let currentBrowser = 'unknown';
let currentSpecFile = 'unknown';
const executionTimestamp =
  process.env.EXECUTION_RUN_TIMESTAMP ?? new Date().toISOString().replace(/[:.]/g, '-');

// ─────────────────────────────────────────────────────────────
// Winston logger factory — per spec + browser
// ─────────────────────────────────────────────────────────────
function getOrCreateLogger(specFile: string, browser: string): winston.Logger {
  const key = `${specFile}__${browser}`;

  if (loggerCache.has(key)) {
    return loggerCache.get(key)!;
  }

  // ── Log file name: specFile_browser_timestamp.log ──
  const sanitizedSpec = specFile.replace(/[^a-z0-9_]/gi, '_');
  const sanitizedBrowser = browser.replace(/[^a-z0-9_]/gi, '_');
  const logFileName = `${sanitizedSpec}__${sanitizedBrowser}__${executionTimestamp}.log`;
  const logFilePath = path.join(logsDir, logFileName);

  const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${level.toUpperCase()}] [${timestamp}] - ${message}`;
    }),
  );

  const logger = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
      // ── File transport — spec specific ──
      new winston.transports.File({
        filename: logFilePath,
        options: { flags: 'a' },
      }),
      // ── Error only file — per spec ──
      new winston.transports.File({
        filename: path.join(
          logsDir,
          `${sanitizedSpec}__${sanitizedBrowser}__${executionTimestamp}__errors.log`,
        ),
        level: 'error',
        options: { flags: 'a' },
      }),
      // ── Console ──
      new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), logFormat),
      }),
    ],
  });

  loggerCache.set(key, logger);
  return logger;
}

// ─────────────────────────────────────────────────────────────
// Buffer key — spec + browser combination
// ─────────────────────────────────────────────────────────────
function getBufferKey(specFile: string, browser: string): string {
  return `${specFile}__${browser}`;
}

// ─────────────────────────────────────────────────────────────
// PUBLIC LOGGER API
// ─────────────────────────────────────────────────────────────
export const Logger = {
  // ── Browser set karo — beforeEach se ──
  setBrowser(browser: string) {
    currentBrowser = browser;
  },

  // ── Spec file set karo — beforeEach se ──
  setSpecFile(specFile: string) {
    currentSpecFile = path.basename(specFile, '.ts');
  },

  info(testName: string, message: string) {
    const key = getBufferKey(currentSpecFile, currentBrowser);
    const entry: LogEntry = {
      level: 'info',
      testName,
      message,
      time: new Date().toISOString(),
    };
    if (!logBuffer.has(key)) logBuffer.set(key, []);
    logBuffer.get(key)!.push(entry);
  },

  warn(testName: string, message: string) {
    const key = getBufferKey(currentSpecFile, currentBrowser);
    const entry: LogEntry = {
      level: 'warn',
      testName,
      message,
      time: new Date().toISOString(),
    };
    if (!logBuffer.has(key)) logBuffer.set(key, []);
    logBuffer.get(key)!.push(entry);
  },

  error(testName: string, message: string) {
    const key = getBufferKey(currentSpecFile, currentBrowser);
    const entry: LogEntry = {
      level: 'error',
      testName,
      message,
      time: new Date().toISOString(),
    };
    if (!logBuffer.has(key)) logBuffer.set(key, []);
    logBuffer.get(key)!.push(entry);
  },

  // ── Flush — afterAll se call karo ──
  flushAll() {
    for (const [bufferKey, entries] of logBuffer.entries()) {
      // ── key = specFile__browser ──
      const parts = bufferKey.split('__');
      const spec = parts[0] ?? 'unknown';
      const browser = parts[1] ?? 'unknown';

      const wLogger = getOrCreateLogger(spec, browser);

      // ── Group by testName ──
      const grouped = new Map<string, LogEntry[]>();
      for (const entry of entries) {
        if (!grouped.has(entry.testName)) grouped.set(entry.testName, []);
        grouped.get(entry.testName)!.push(entry);
      }

      for (const [testName, testEntries] of grouped.entries()) {
        // ── Test header ──
        wLogger.info(`\n${'='.repeat(10)} ${testName} (${browser}) ${'='.repeat(10)}`);

        for (const e of testEntries) {
          if (e.level === 'error') {
            wLogger.error(e.message);
          } else if (e.level === 'warn') {
            wLogger.warn(e.message);
          } else {
            wLogger.info(e.message);
          }
        }
      }
    }

    logBuffer.clear();
  },
};
