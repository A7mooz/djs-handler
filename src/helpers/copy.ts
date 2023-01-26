import { createSpinner } from 'nanospinner';
import { join } from 'path';
import { templatesDir } from './templates.js';
import fs from 'fs/promises';

/**
 *
 * @param template The template to load
 *
 * @param path The path to the process
 */
export async function copy(template: string, path: string) {
    const spinner = createSpinner('Copying template').start();

    const source = join(templatesDir, template);

    return await fs
        .cp(source, path, { recursive: true })
        .then(() => {
            spinner.success();
        })
        .catch((err: Error) => {
            spinner.error({ text: err.toString() });
        });
}
