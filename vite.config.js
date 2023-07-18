import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json,woff,woff2,ttf}"],
      },
      includeAssets: ["ontime192.png", "ontime512.png"],
      manifest: {
        name: "On-Time Bus time Tracker",
        short_name: "On-Time",
        description: "track the next bus arriving time with on time.",
        theme_color: "#ffffff",
        icons: [
          {
            src: "ontime192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "ontime512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  base: "/on-time/",
});
