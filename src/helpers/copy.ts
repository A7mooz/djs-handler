import { createSpinner } from 'nanospinner';
import { join, basename } from 'path';
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

    const name = basename(path);

    const source = join(templatesDir, template);

    return await fs
        .cp(source, path, { recursive: true })
        .then(async () => {
            const packageJsonUrl = join(path, 'package.json');
            const pkg: Record<string, unknown> = JSON.parse(
                await fs.readFile(packageJsonUrl, 'utf-8'),
            );

            pkg.name = name.toLowerCase();

            await fs.writeFile(packageJsonUrl, JSON.stringify(pkg, null, 4));

            spinner.success();
        })
        .catch((err: Error) => {
            spinner.error({ text: err.toString() });
            process.exit(2);
        });
}
