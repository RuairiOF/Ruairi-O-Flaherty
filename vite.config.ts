import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          gsap: ['gsap', '@gsap/react'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
