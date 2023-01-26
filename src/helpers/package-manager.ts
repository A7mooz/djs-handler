import { createSpinner } from 'nanospinner';
import { exec } from 'child_process';
import { promisify } from 'util';

/**
 *
 * @param pm The package manager
 *
 * @param path The path to the process
 */
export async function install(pm: string, path: string) {
    if (pm.startsWith('none')) return;

    const spinner = createSpinner('Installing Packages').start();

    return await promisify(exec)(`cd ${path} && ${pm} ${pm !== 'yarn' ? 'install' : ''}`)
        .then(() => {
            spinner.success();
        })
        .catch((err: Error) => {
            spinner.error({ text: err.toString() });
        });
}
