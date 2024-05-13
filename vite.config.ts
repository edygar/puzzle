import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { VitePWA } from "vite-plugin-pwa";
import devtools from "solid-devtools/vite";

export default defineConfig({
  base: "/puzzle/",
  plugins: [
    devtools({
      /* features options - all disabled by default */
      autoname: true, // e.g. enable autoname
    }),
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
            src: "/puzzle/assets/icon-196x196.png",
            sizes: "196x196",
            type: "image/png",
          },
          {
            src: "/puzzle/assets/icon-256x256.png",
            sizes: "256x256",
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
