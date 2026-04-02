import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: null,
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "Screenshot 2026-04-02 230712.png"],

      manifest: {
        name: "ADMIN",
        short_name: "ADMIN",
        description: "Marycielo Travel Admin Portal",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/admin",
        start_url: "/admin",
        icons: [
          {
            src: "/Screenshot 2026-04-02 230712.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/Screenshot 2026-04-02 230712.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/Screenshot 2026-04-02 230712.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          }
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));

