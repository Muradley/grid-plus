import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        dts({
            insertTypesEntry: true,
            outDir: 'dist',
            include: ['src/index.ts'],
            exclude: ['src/styles/**/*', '**/*.css'],
            rollupTypes: true,
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        lib: {
            entry: {
                index: resolve(__dirname, 'src/index.ts'),
                styles: resolve(__dirname, 'src/styles/index.css'),
            },
            name: 'GridPlus',
            formats: ['es'],
            fileName: (format, entryName) => {
                if (entryName === 'index') return `grid-plus.${format}.js`;
                return `${entryName}.js`;
            },
        },
        cssCodeSplit: true,
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                '@tanstack/react-table',
                '@tanstack/react-virtual',
            ],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    '@tanstack/react-table': 'ReactTable',
                    '@tanstack/react-virtual': 'ReactVirtual',
                },
                assetFileNames: 'styles.css',
            },
        },
        sourcemap: true,
        emptyOutDir: true,
    },
});
