import fs from 'fs';

const logFilePath = process.env.LOG_FILE_PATH || 'logs/default.log';

export class Logger {
  private static testLogs: Map<string, string[]> = new Map();

  static info(testName: string, message: string) {
    this.addLog('INFO', testName, message);
  }

  static error(testName: string, message: string) {
    this.addLog('ERROR', testName, `❌ ${message}`);
  }

  static warn(testName: string, message: string) {
    this.addLog('WARN', testName, message);
  }

  private static addLog(level: string, testName: string, message: string) {
    const formatted = `[${level}] ${new Date().toISOString()} - ${message}`;

    if (!this.testLogs.has(testName)) {
      this.testLogs.set(testName, []);
    }

    this.testLogs.get(testName)?.push(formatted);
  }

  static markTestEnd(_testName: string) {
    // marker only (optional)
  }

  // NEW METHOD — Flush All At End (Sorted)
  static flushAll() {
    const sortedTests = Array.from(this.testLogs.keys()).sort((a, b) => {
      const numA = parseInt(a.split('.')[0]);
      const numB = parseInt(b.split('.')[0]);

      return numA - numB;
    });

    let finalOutput = '';

    for (const testName of sortedTests) {
      const logs = this.testLogs.get(testName);
      if (!logs) continue;

      finalOutput += `\n========== ${testName} ==========\n` + logs.join('\n') + '\n\n';
    }

    fs.appendFileSync(logFilePath, finalOutput);

    this.testLogs.clear();
  }
}
