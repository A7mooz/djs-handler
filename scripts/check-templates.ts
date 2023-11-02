#!/usr/bin/env -S node --loader ts-node/esm --no-warnings

import { execSync } from 'child_process';
import { createSpinner } from 'nanospinner';
import path from 'path';
import { templates, templatesDir } from '../src/helpers/templates.js';

const spinner = createSpinner('Checking templates').start();

for (const template of templates) {
    const dir = path.join(templatesDir, template);

    execSync('pnpm install', { cwd: dir });
    execSync(`pnpm exec tsc -p ${dir}`);
}

spinner.success();
