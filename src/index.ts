#!/usr/bin/env node

import { handle } from './helpers/handle.js';
import { ask } from './helpers/prompt.js';

const answers = await ask();

await handle(answers);
