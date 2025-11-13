import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,ico,png,svg,woff,woff2,ttf,xlsx}', 'index.html'],
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: /\.(?:js|css|png|svg|woff2?|ttf|ico|xlsx)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },

      includeAssets: ['ontime192.png', 'ontime512.png'],
      manifest: {
        name: 'On-Time Bus time Tracker',
        short_name: 'On-Time',
        description: 'track the next bus arriving time with on time.',
        theme_color: '#ffffff',
        start_url: '.',
        icons: [
          {
            src: 'ontime192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'ontime512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})
