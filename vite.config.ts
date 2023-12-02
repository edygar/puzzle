import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/puzzle/",
  plugins: [
    solid(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        theme_color: "#6366f1",
        background_color: "#6366f1",
        display: "standalone",
        scope: "/puzzle",
        start_url: "/puzzle",
        name: "Picture Puzzle",
        description: "Picture Puzzle Game",
        short_name: "Picture Puzzle",
        icons: [
          {
            src: "/puzzle/assets/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/puzzle/assets/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "/puzzle/assets/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "/puzzle/assets/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
