import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";
  process.env.NODE_ENV = isProduction ? "production" : "development";

  return {
    server: {
      host: "::",
      port: 3000, // Changed from 8080 to 3000 to avoid conflict with backend
      allowedHosts: true,
    },
    preview: {
      host: "0.0.0.0",
      port: 4173,
      allowedHosts: true,
    },
    define: {
      "process.env.NODE_ENV": JSON.stringify(isProduction ? "production" : "development"),
      __DEV__: JSON.stringify(!isProduction),
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});