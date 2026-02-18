import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@stripe')) {
              return 'stripe';
            }
            if (id.includes('socket.io-client')) {
              return 'socket';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor';
            }
          }
          const isAdmin = id.includes('src/admin') || id.includes('src\\admin');
          if (isAdmin) {
            return 'admin';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info']
      }
    },
    cssCodeSplit: true,
    sourcemap: false
  },
  server: {
    hmr: { overlay: false }
  }
})
