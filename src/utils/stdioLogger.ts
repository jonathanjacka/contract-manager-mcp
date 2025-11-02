import fs from 'fs';

export function redirectConsoleToFile(logPath: string): void {
  const logStream = fs.createWriteStream(logPath, { flags: 'a' });

  const createLogWriter =
    (level: string) =>
    (...args: any[]) => {
      const timestamp = new Date().toISOString();
      const message = args
        .map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
        .join(' ');
      logStream.write(`[${timestamp}] ${level}: ${message}\n`);
    };

  console.error = createLogWriter('ERROR');
  console.warn = createLogWriter('WARN');
  console.info = createLogWriter('INFO');
  console.log = createLogWriter('LOG');
}
