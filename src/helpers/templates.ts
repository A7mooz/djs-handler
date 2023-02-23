import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export const templatesDir = join(fileURLToPath(dirname(import.meta.url)), '../..', 'templates');

export const templates = Object.freeze(fs.readdirSync(templatesDir));
