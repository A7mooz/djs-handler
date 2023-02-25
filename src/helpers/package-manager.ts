import { createSpinner } from 'nanospinner';
import { exec } from 'child_process';
import { promisify } from 'util';

export enum PM {
    npm,
    yarn,
    pnpm,
    none,
}

/**
 *
 * @param pm The package manager
 *
 * @param path The path to the process
 */
export async function install(pm: Exclude<PM, PM.none>, path: string) {
    const spinner = createSpinner('Installing Packages').start();

    return await promisify(exec)(`cd ${path} && ${PM[pm]} ${pm !== PM.yarn ? 'install' : ''}`)
        .then((value) => {
            spinner.success();
            return value;
        })
        .catch((err: Error) => {
            spinner.error({ text: err.toString() });
            process.exit(2);
        });
}

const Managers = ['npm', 'pnpm', 'yarn'] as const;

export function getCurrentPackageManager() {
    const defaultManager = PM.npm;

    const userAgent = process.env.npm_config_user_agent;
    if (!userAgent) {
        return defaultManager;
    }

    const manager = Managers.find((pm) => userAgent.startsWith(pm)) ?? Managers[defaultManager];

    return PM[manager];
}
