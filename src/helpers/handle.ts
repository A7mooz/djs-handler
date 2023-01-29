import { ExpectedAnswers } from './prompt.js';
import { copy } from './copy.js';
import { install } from './package-manager.js';
import { templates } from './templates.js';
import path from 'path';
import chalk from 'chalk';

export async function handle(answers: ExpectedAnswers) {
    const projectName = answers.name;
    const projectPath = path.resolve(projectName);

    // TODO add mutpile templates to choose from
    const template =
        'template' in answers && typeof answers.template == 'string'
            ? answers.template
            : templates[0];

    const pm = answers.manager.startsWith('none') ? null : answers.manager;

    await Promise.all([await copy(template, projectPath), await install(pm, projectPath)]);

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
