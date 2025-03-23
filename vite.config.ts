import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'sip': ['sip.js'],
          'utils': ['xlsx', 'zustand']
        }
      }
    }
  },
  server: {
    host: true,
    port: 8082,
    strictPort: true,
    headers: {
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  },
  preview: {
    host: true,
    port: 8082,
    strictPort: true
  }
});