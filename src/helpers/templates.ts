import fs from 'fs';

export const templatesDir = 'templates';

export const templates = fs.readdirSync(templatesDir);
