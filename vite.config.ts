import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';

export default defineConfig({
    plugins: [tsconfigPaths({
        loose: true,
        root: './src'
    })],
    test: {
        environmentMatchGlobs: [['src/http/controllers/**', 'prisma']],
        // environment: './prisma/vitest-environment-prisma/prisma-test-environment',
    },
    resolve: {
        alias: [
            { find: "@/", replacement: resolve(__dirname, "./src") }
        ]
    },
});
