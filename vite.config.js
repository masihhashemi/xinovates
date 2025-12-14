import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path configuration:
// - '/xinovates/' for GitHub Pages with repository name in URL
// - '/' for custom domain or root domain GitHub Pages
// Change this to '/' when you set up your custom domain
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  base: process.env.VITE_BASE_PATH || '/xinovates/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})

