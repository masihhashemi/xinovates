import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path configuration:
// - '/xinovates/' for GitHub Pages with repository name in URL
// - '/' for custom domain (xinovates.co.uk)
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})

