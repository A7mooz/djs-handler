import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        dir: 'tests',
        testTimeout: 0,
        clearMocks: true,
        silent: true,
    },
});
