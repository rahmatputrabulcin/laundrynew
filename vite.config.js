import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/js/app.jsx', // atau app.js jika Anda pakai JS
                'resources/css/app.css', // jika ada CSS utama
            ],
            refresh: true,
        }),
        react(),
    ],
});
