import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ModernVectorWebGL',
      fileName: 'modern-vector-webgl'
    },
    rollupOptions: {
      external: ['@modern-vector/core', 'gl-matrix'],
      output: {
        globals: {
          '@modern-vector/core': 'ModernVectorCore',
          'gl-matrix': 'glMatrix'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@modern-vector/core': resolve(__dirname, '../core/src')
    }
  }
});