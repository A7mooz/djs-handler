import { ExpectedAnswers } from '../index.js';
import { copy } from './copy.js';
import { install } from './package-manager.js';
import { templates } from './templates.js';
import path from 'path';

export async function handle(answers: ExpectedAnswers) {
    const projectPath = path.resolve(answers.name);

    // TODO add mutpile templates to choose from
    const template =
        'template' in answers && typeof answers.template == 'string'
            ? answers.template
            : templates[0];

    await Promise.all([
        await copy(template, projectPath),
        await install(answers.manager, projectPath),
    ]);
}
