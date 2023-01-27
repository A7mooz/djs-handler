import { createSpinner } from 'nanospinner';
import { exec } from 'child_process';
import { promisify } from 'util';

/**
 *
 * @param pm The package manager
 *
 * @param path The path to the process
 */
export async function install(pm: string | null, path: string) {
    if (!pm) return;

    const spinner = createSpinner('Installing Packages').start();

    return await promisify(exec)(`cd ${path} && ${pm} ${pm !== 'yarn' ? 'install' : ''}`)
        .then((value) => {
            spinner.success();
            return value;
        })
        .catch((err: Error) => {
            spinner.error({ text: err.toString() });
            process.exit(2);
        });
}
