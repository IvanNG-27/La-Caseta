import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    // App web instalable y sin conexión (PROPUESTA 01: funciona sin conexión y sin cuentas).
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon-64.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'La Caseta Game',
        short_name: 'La Caseta Game',
        description: 'Juegos de fiesta para jugar pasando un solo móvil: Impostor, Verdad o reto y Yo nunca.',
        lang: 'es-ES',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#111111',
        background_color: '#FFFFFF',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Las fuentes (con sus subconjuntos japoneses) también quedan guardadas para jugar sin conexión.
        globPatterns: ['**/*.{js,css,html,png,gif,woff2,mp3}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
  // Rutas relativas: el mismo build sirve en GitHub Pages (/La-Caseta/) y dentro de Capacitor.
  base: './',
});
