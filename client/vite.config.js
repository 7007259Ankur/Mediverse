import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',  // ✅ Add this for Netlify relative paths

  server: {
    proxy: {
      '/api': {
        target: 'https://myserver-ibee.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'https://myserver-ibee.onrender.com',
        changeOrigin: true,
        ws: true,
      },
      '/health-api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/health-api/, '/api/health'),
      }
    }
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})
