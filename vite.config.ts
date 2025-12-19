import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),      // ← MANQUAIT !
    tailwindcss() // ← OK
  ],
  base: "./",     // ← IMPORTANT pour un projet Vite déployé sur Vercel
});
