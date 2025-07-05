import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
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
            fileName: (format, entryName) => {
                if (entryName === 'styles') {
                    return `styles.css`;
                }
                return `grid-plus.${format}.js`;
            },
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                        return 'styles.css';
                    }
                    return assetInfo.name || 'assets/[name]-[hash][extname]';
                },
            },
        },
        sourcemap: true,
        emptyOutDir: true,
    },
});
