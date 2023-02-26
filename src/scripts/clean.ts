import rimraf from 'rimraf';
import { templates, templatesDir } from '../helpers/templates.js';
import { join } from 'path';

const deleted = ['node_modules', 'pnpm-lock.yaml', 'yarn.lock', 'package-lock.json', 'dist'];

for (const template of templates)
    for (const file of deleted) await rimraf(join(templatesDir, template, file));
