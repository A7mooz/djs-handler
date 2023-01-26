import fs from 'fs';
import { join } from 'path';

export const templatesDir = join(process.cwd(), 'templates');

export const templates = fs.readdirSync(templatesDir);
