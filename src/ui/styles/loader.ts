import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load CSS file content for embedding in HTML
export function loadStyles(cssFileName: string): string {
  const cssPath = path.join(__dirname, cssFileName);
  return fs.readFileSync(cssPath, 'utf-8');
}
