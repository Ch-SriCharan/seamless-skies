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
  }
})
