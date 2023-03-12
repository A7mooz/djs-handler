import fs from 'fs/promises';
import { createSpinner } from 'nanospinner';
import { basename, join } from 'path';
import { PM } from './package-manager.js';
import { templatesDir } from './templates.js';

/**
 *
 * @param template The template to load
 *
 * @param path The path to the process
 */
export async function copy(template: string, path: string, pm: PM) {
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
            if (pm === PM.npm) delete pkg.resolutions;
            else if (pm !== PM.none) delete pkg.overrides;

            await fs.writeFile(packageJsonUrl, JSON.stringify(pkg, null, 4));

            await fs.cp(join(path, '.env.example'), join(path, '.env'));

            spinner.success();
        })
        .catch((err: Error) => {
            spinner.error({ text: err.toString() });
            process.exit(2);
        });
}
