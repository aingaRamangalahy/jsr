import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  publicDir: resolve(__dirname, '../shared/assets'),
  server: {
    port: 3001
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@jsr/shared': resolve(__dirname, '../shared')
    }
  },
  // Skip TypeScript checks for builds
  build: {
    // Skip TypeScript type checking
    minify: true,
    rollupOptions: {
      onwarn(warning, warn) {
        // Skip certain warnings
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        if (warning.code === 'TS_ERROR') return;
        warn(warning);
      },
    },
  }
}) 