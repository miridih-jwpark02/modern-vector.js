import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ModernVector',
      fileName: 'modern-vector'
    },
    rollupOptions: {
      external: ['gl-matrix'],
      output: {
        globals: {
          'gl-matrix': 'glMatrix'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
});