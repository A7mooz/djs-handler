import { existsSync } from 'fs';
import { readdir, rm } from 'fs/promises';
import { join } from 'path';
import { expect, test } from 'vitest';
import { handle } from '../src/helpers/handle';
import { PM } from '../src/helpers/package-manager';

const MAIN_PATH = 'tests/.cache';

const ExpectedFiles = {
    base: ['node_modules'],
    npm: ['package-lock.json'],
    pnpm: ['pnpm-lock.yaml'],
    yarn: ['yarn.lock'],
};

const CheckExpected = (pm: string) => (file: string) =>
    Object.entries(ExpectedFiles).some(([k, v]) =>
        [pm, 'base'].includes(k) ? v.includes(file) : !v.includes(file),
    );

test('Create a project and install dependencies with npm', async () => {
    const path = join(MAIN_PATH, 'npm');

    await expect(
        handle({
            manager: PM.npm,
            name: path,
        }),
    ).resolves.not.toThrowError();

    expect(existsSync(path)).toBe(true);

    const files = await readdir(path);

    expect(files.every(CheckExpected('npm'))).toBe(true);

    await expect(rm(MAIN_PATH, { recursive: true })).resolves.not.toThrowError();
});

test('Create a project and install dependencies with pnpm', async () => {
    const path = join(MAIN_PATH, 'pnpm');

    await expect(
        handle({
            manager: PM.pnpm,
            name: path,
        }),
    ).resolves.not.toThrowError();

    expect(existsSync(path)).toBe(true);

    const files = await readdir(path);

    expect(files.every(CheckExpected('pnpm'))).toBe(true);

    await expect(rm(MAIN_PATH, { recursive: true })).resolves.not.toThrowError();
});

test('Create a project and install dependencies with yarn', async () => {
    const path = join(MAIN_PATH, 'yarn');

    await expect(
        handle({
            manager: PM.yarn,
            name: path,
        }),
    ).resolves.not.toThrowError();

    expect(existsSync(path)).toBe(true);

    const files = await readdir(path);

    expect(files.every(CheckExpected('yarn'))).toBe(true);

    await expect(rm(MAIN_PATH, { recursive: true })).resolves.not.toThrowError();
});

test('Create a project and not install dependencies', async () => {
    const path = join(MAIN_PATH, 'none');

    await expect(
        handle({
            manager: PM.none,
            name: path,
        }),
    ).resolves.not.toThrowError();

    expect(existsSync(path)).toBe(true);

    const files = await readdir(path);

    expect(
        files.every((file: string) =>
            Object.entries(ExpectedFiles).every(([, v]) => !v.includes(file)),
        ),
    ).toBe(true);

    await expect(rm(MAIN_PATH, { recursive: true })).resolves.not.toThrowError();
});
