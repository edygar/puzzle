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
        name: "",
        short_name: "Puzzle",
        description: "A puzzle game",
        theme_color: "#6366f1",
        background_color: "#6366f1",
        display: "standalone",
        scope: "/",
        start_url: "/",
        orientation: "portrait",
      },
    }),
  ],
});
