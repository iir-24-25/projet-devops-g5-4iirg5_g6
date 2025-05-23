import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    global: 'globalThis', // This helps with issues in environments like Node.js
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      plugins: [
        {
          name: 'polyfill-crypto',
          resolveId(source) {
            if (source === 'crypto') {
              return this.resolve('crypto-browserify');
            }
          },
        },
      ],
    },
  },
});
