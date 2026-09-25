import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: './',
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      // Exclude native Node modules from being bundled into the browser/renderer build
      external: ['better-sqlite3'],
    },
  },
})