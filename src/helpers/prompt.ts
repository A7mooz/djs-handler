import chalk from 'chalk';
import figlet from 'figlet';
import { readFileSync } from 'fs';
import inquirer from 'inquirer';
import validate from 'validate-npm-package-name';
import { ExpectedAnswers } from '../types.js';
import { getCurrentPackageManager, PM } from './package-manager.js';

export async function ask(): Promise<ExpectedAnswers> {
    const { version }: { version: string } = JSON.parse(
        readFileSync(new URL('../../package.json', import.meta.url), 'utf-8'),
    );

    console.log(`${figlet.textSync('DJS HANDLER', 'ANSI Shadow')}\n${chalk.dim(`v${version}`)}\n`);

    return await inquirer.prompt<ExpectedAnswers>([
        {
            name: 'name',
            message: 'What is your project name',
            default: 'my-bot',
            validate(input: string) {
                return validate(input).errors?.join('\n') ?? true;
            },
            transformer(input: string) {
                return input.replaceAll(/\s+/g, '');
            },
            prefix: chalk.cyan('?'),
            suffix: '?',
        },
        {
            name: 'manager',
            message: 'Which package manage would you use',
            type: 'list',
            default: getCurrentPackageManager(),
            choices: [
                { name: 'npm', value: PM.npm },
                { name: 'yarn', value: PM.yarn },
                { name: 'pnpm', value: PM.pnpm },
                {
                    name: 'none - do not install packages',
                    value: PM.none,
                },
            ],
            prefix: chalk.cyan('>'),
            suffix: '?',
        },
    ]);
}
