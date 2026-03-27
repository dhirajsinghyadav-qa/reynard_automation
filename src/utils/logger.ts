/* import fs from 'fs';

const logDir = 'logs';
const logFilePath = process.env.LOG_FILE_PATH || `${logDir}/execution.log`;

export class Logger {
  private static testLogs: Map<string, string[]> = new Map();
  private static testBrowserMap: Map<string, string> = new Map();

  private static currentBrowser: string = 'unknown';

  private static ensureLogFolder() {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  static setBrowser(browser: string) {
    this.currentBrowser = browser;
  }

  static info(testName: string, message: string) {
    this.addLog('INFO', testName, message);
  }

  static warn(testName: string, message: string) {
    this.addLog('WARN', testName, message);
  }

  static error(testName: string, message: string) {
    this.addLog('ERROR', testName, message);
  }

  private static addLog(level: string, testName: string, message: string) {
    const timestamp = new Date().toISOString();
    const formatted = `[${level}] [${timestamp}]  - ${message}`;

    // console.log(`[${testName}] ${formatted}`);

    if (!this.testLogs.has(testName)) {
      this.testLogs.set(testName, []);
    }

    this.testLogs.get(testName)?.push(formatted);

    if (!this.testBrowserMap.has(testName)) {
      this.testBrowserMap.set(testName, this.currentBrowser);
    }
  }

  static flushAll() {
    this.ensureLogFolder();

    const sortedTests = Array.from(this.testLogs.keys()).sort((a, b) => {
      const numA = parseInt(a.split('.')[0]);
      const numB = parseInt(b.split('.')[0]);
      return numA - numB;
    });

    let finalOutput = '';

    for (const testName of sortedTests) {
      const logs = this.testLogs.get(testName);
      if (!logs) continue;

      const browser = this.testBrowserMap.get(testName) || 'unknown';

      finalOutput += `\n========== ${testName} (${browser}) ==========\n`;
      finalOutput += logs.join('\n') + '\n';
    }

    fs.appendFileSync(logFilePath, finalOutput);

    this.testLogs.clear();
    this.testBrowserMap.clear();
  }
}


import fs from 'fs';

const logDir = 'logs';

export class Logger {
  private static testLogs: Map<string, string[]> = new Map();
  private static currentBrowser: string = 'unknown';

  static setBrowser(browser: string) {
    this.currentBrowser = browser;
  }

  static info(testName: string, message: string) {
    const timestamp = new Date().toISOString();
    const formatted = `[INFO] [${timestamp}] - ${message}`;

    if (!this.testLogs.has(testName)) {
      this.testLogs.set(testName, []);
    }

    this.testLogs.get(testName)?.push(formatted);
  }

  static flushAll() {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const filePath = `${logDir}/execution-${this.currentBrowser}.log`;

    let finalOutput = '';

    for (const [testName, logs] of this.testLogs) {
      finalOutput += `\n========== ${testName} ==========\n`;
      finalOutput += logs.join('\n') + '\n';
    }

    fs.appendFileSync(filePath, finalOutput);

    this.testLogs.clear();
  }
} */

import fs from 'fs';

const logDir = 'logs';

export class Logger {
  private static testLogs: Map<string, string[]> = new Map();
  private static testBrowserMap: Map<string, string> = new Map();

  private static currentBrowser: string = 'unknown';

  private static ensureLogFolder() {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  static setBrowser(browser: string) {
    this.currentBrowser = browser;
  }

  static info(testName: string, message: string) {
    this.addLog('INFO', testName, message);
  }

  static warn(testName: string, message: string) {
    this.addLog('WARN', testName, message);
  }

  static error(testName: string, message: string) {
    this.addLog('ERROR', testName, message);
  }

  private static addLog(level: string, testName: string, message: string) {
    const timestamp = new Date().toISOString();
    const formatted = `[${level}] [${timestamp}] - ${message}`;

    if (!this.testLogs.has(testName)) {
      this.testLogs.set(testName, []);
    }

    this.testLogs.get(testName)?.push(formatted);

    if (!this.testBrowserMap.has(testName)) {
      this.testBrowserMap.set(testName, this.currentBrowser);
    }
  }

  static flushAll() {
    this.ensureLogFolder();

    // ✅ ONE FILE PER BROWSER (FIXED NAME)
    const runTimestamp = process.env.EXECUTION_RUN_TIMESTAMP || 'no-timestamp';
    const filePath = `${logDir}/execution-${this.currentBrowser}-${runTimestamp}.log`;

    let finalOutput = '';

    const sortedTests = Array.from(this.testLogs.keys()).sort((a, b) => {
      const numA = parseInt(a.split('.')[0]);
      const numB = parseInt(b.split('.')[0]);
      return numA - numB;
    });

    for (const testName of sortedTests) {
      const logs = this.testLogs.get(testName);
      if (!logs) continue;

      const browser = this.testBrowserMap.get(testName) || 'unknown';

      finalOutput += `\n========== ${testName} (${browser}) ==========\n`;
      finalOutput += logs.join('\n') + '\n';
    }

    // ✅ APPEND → multiple workers same file me likhenge
    fs.appendFileSync(filePath, finalOutput);

    this.testLogs.clear();
    this.testBrowserMap.clear();
  }
}
