import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

export const templatesDir = join(fileURLToPath(dirname(import.meta.url)), '../..', 'templates');

export const templates = fs.readdirSync(templatesDir);
