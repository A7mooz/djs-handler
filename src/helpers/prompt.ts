import chalk from 'chalk';
import figlet from 'figlet';
import { readFileSync } from 'fs';
import inquirer, { Answers, DistinctQuestion } from 'inquirer';
import validate from 'validate-npm-package-name';
import { ExpectedAnswers } from '../types.js';
import { getCurrentPackageManager, PM } from './package-manager.js';

export async function ask(): Promise<ExpectedAnswers> {
    const { version }: { version: string } = JSON.parse(
        readFileSync(new URL('../../package.json', import.meta.url), 'utf-8'),
    );

    console.log(`${figlet.textSync('DJS HANDLER', 'ANSI Shadow')}\n${chalk.dim(`v${version}`)}\n`);

    return await safePrompt<ExpectedAnswers>([
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

export async function safePrompt<T extends Answers>(question: DistinctQuestion<T>[]): Promise<T> {
    const promptModule = inquirer.createPromptModule();
    const ui = new inquirer.ui.Prompt<T>(promptModule.prompts);

    // Remove the force-quit behavior
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { rl } = ui;
    rl.listeners('SIGINT').forEach((listener) => rl.off('SIGINT', listener as () => unknown));

    // Insert our listener to reject the promise
    function handleCtrlC() {
        // remove the listener
        rl.off('SIGINT', handleCtrlC);

        // Clean up inquirer
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ui.close();

        // Then reject our promise
        process.exit(0);
    }
    rl.on('SIGINT', handleCtrlC);

    // Run the UI
    return ui.run(question);
}
