import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'https://auth.opensky-network.org',
        changeOrigin: true
      },
      '/api': {
        target: 'https://opensky-network.org',
        changeOrigin: true
      }
    }
  },
  build: {
    // Generate source maps for better debuggability
    sourcemap: true,
    rollupOptions: {
      output: {
        // Split large vendor libraries into their own cached chunks (function form for Vite 8/rolldown)
        manualChunks(id) {
          if (id.includes('node_modules/leaflet') || id.includes('node_modules/react-leaflet')) {
            return 'leaflet-vendor';
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'react-vendor';
          }
        },
      },
    },
  },
})
