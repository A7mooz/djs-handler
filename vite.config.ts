import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        dir: 'tests',
        testTimeout: 0,
        silent: true,
    },
});
