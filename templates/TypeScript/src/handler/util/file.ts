import { readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export const _dirname = join(dirname(fileURLToPath(`${import.meta.url}`)), '../../');

export const allowedFilePattern = /\.(j|t|mj)s$/;

export function getAllFiles(dir: string) {
    return readdirSync(join(_dirname, dir), { withFileTypes: true }).filter(
        (v) => v.isDirectory() || (v.isFile() && allowedFilePattern.test(v.name)),
    );
}
