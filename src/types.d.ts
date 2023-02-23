import { L } from 'ts-toolbelt';
import { Managers } from './helpers/prompt.js';

export type None = L.Last<typeof Managers>;

export type PM = L.UnionOf<L.Pop<typeof Managers>>;

export type ExpectedAnswers = {
    name: string;
    manager: L.UnionOf<typeof Managers>;
};
