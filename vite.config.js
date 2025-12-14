import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For GitHub Pages, use '/xinovates/'
// For custom domain or other hosting, use '/'
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  base: '/xinovates/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})

