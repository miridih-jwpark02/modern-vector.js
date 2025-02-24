import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ModernVectorSVG',
      fileName: 'modern-vector-svg'
    },
    rollupOptions: {
      external: ['@modern-vector/core'],
      output: {
        globals: {
          '@modern-vector/core': 'ModernVectorCore'
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