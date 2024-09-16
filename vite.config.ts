import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';

export default defineConfig({
    plugins: [tsconfigPaths({
        loose: true,
        root: './src'
    })],
    resolve: {
        alias: [
            { find: "@/", replacement: resolve(__dirname, "./src") }
        ]
    },
});
