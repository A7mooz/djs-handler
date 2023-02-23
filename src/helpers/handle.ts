import chalk from 'chalk';
import path from 'path';
import { ExpectedAnswers, None } from '../types.js';
import { copy } from './copy.js';
import { install } from './package-manager.js';
import { Managers } from './prompt.js';
import { templates } from './templates.js';

const none = Managers.at(-1) as None;

export async function handle(answers: ExpectedAnswers) {
    const projectName = answers.name;
    const projectPath = path.resolve(projectName);

    // TODO add mutpile templates to choose from
    const template =
        'template' in answers && typeof answers.template == 'string'
            ? answers.template
            : templates[0];

    const pm = answers.manager === none ? null : answers.manager;

    if (pm)
        await Promise.all([await copy(template, projectPath, pm), await install(pm, projectPath)]);

    console.log(
        chalk.greenBright('√'),
        chalk.bold('Created discord.js project'),
        chalk.gray('»'),
        chalk.greenBright(projectName),
    );

    console.log(chalk.blueBright('?'), chalk.bold('Next Steps!'));
    console.log(`\t> // Set your environment variables in .env (example in .env.example)`);
    console.log(`\t> cd ${path.relative(process.cwd(), projectPath)}`);

    if (pm) console.log(`\t> ${pm} run dev`);
    else {
        console.log('\t> npm install');
        console.log('\t> npm run dev');
    }
}
