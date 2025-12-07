import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isDocker = process.env.DOCKER_ENV === 'true';
const backendTarget = isDocker ? 'http://backend:8000' : (process.env.BACKEND_URL || 'http://localhost:8000');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    strictPort: true,
    allowedHosts: ['agdemoto.fr', 'www.agdemoto.fr'],
    proxy: {
      '/api': {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
      '/media': {
        target: 'https://agdemoto.fr',
        changeOrigin: true,
        secure: true
      },
      '/static': {
        target: backendTarget,
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    port: 4173,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
      '/media': {
        target: 'https://agdemoto.fr',
        changeOrigin: true,
        secure: true
      },
      '/static': {
        target: backendTarget,
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
});
