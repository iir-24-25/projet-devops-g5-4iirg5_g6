import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import NodePolyfillPlugin from 'vite-plugin-node-polyfills'; // Import the polyfill plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), NodePolyfillPlugin()],
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
