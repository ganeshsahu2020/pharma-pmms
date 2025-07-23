// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,        // ✅ Consistent dev server port
    strictPort: true   // ❌ Don't fallback to another port if 5173 is in use
  },
  base: '/',           // 📍 Ensures correct routing with React Router
  build: {
    outDir: 'dist',     // 📦 Output build folder
    emptyOutDir: true   // 🧹 Clean before building
  }
});
