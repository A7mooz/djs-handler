#!/usr/bin/env node

import inquirer from "inquirer";
import validate from "validate-npm-package-name";
import chalk from "chalk";
import figlet from "figlet";
import { readFileSync } from "fs";
const { version } = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf-8")
);

console.log(
  `${figlet.textSync("HANDLER", "ANSI Shadow")}${chalk.dim(`v${version}`)}\n`
);

const answers = await inquirer.prompt<{
  name: string;
  manager: string;
}>([
  {
    name: "name",
    message: "What is your project name",
    default: "my-bot",
    validate(input: string) {
      return validate(input).errors?.[0] ?? true;
    },
    transformer(input: string) {
      return input.toLowerCase().replaceAll(/\s+/g, "");
    },
    prefix: chalk.cyan("?"),
    suffix: "?",
  },
  {
    name: "manager",
    message: "Which package manage would you use",
    type: "list",
    default: "npm",
    choices: ["npm", "pnpm", "yarn", "none - don't install packages"],
    prefix: chalk.cyan(">"),
    suffix: "?",
  },
  {
    name: "template",
    message: "Choose a template.",
    type: "list",
    choices: ["TypeScript", "JavaScript", "EcmaScript"],
    prefix: chalk.cyan(">"),
  },
]);

console.log(answers);
