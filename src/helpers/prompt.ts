import chalk from 'chalk';
import figlet from 'figlet';
import { readFileSync } from 'fs';
import inquirer from 'inquirer';
import validate from 'validate-npm-package-name';
import { ExpectedAnswers } from '../types.js';

export const Managers = ['npm', 'pnpm', 'yarn', "none - don't install packages"] as const;

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
            default: 'npm',
            choices: Managers,
            prefix: chalk.cyan('>'),
            suffix: '?',
        },
    ]);
}
