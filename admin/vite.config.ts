import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    port: 3002
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@jsr/shared': resolve(__dirname, '../shared')
    }
  }
})
