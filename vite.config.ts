import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: [
        ".",               // allow entire workspace (fix 403)
        "./client",
        "./shared"
      ],
      deny: [
        ".env",
        ".env.*",
        "*.{crt,pem}",
        "**/.git/**",
        "server/**",
      ],
    },
  },

  build: {
    outDir: "dist/spa",
  },

  plugins: [
    react(),
    expressPlugin(), // our custom plugin
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
});

// ✅ FIX: Strongly typed plugin and valid structure
function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // valid in TS
    configureServer(server) {
      const app = createServer();
      server.middlewares.use(app);
    },
  };
}
