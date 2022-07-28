import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactScopedCssPlugin from 'rollup-plugin-react-scoped-css'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), reactScopedCssPlugin()],
  server: {
    proxy: {
      '^/api/*': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '^/rt/*': {
        target: 'http://localhost:8080'
      },
      '^/local-file/': {
        target: 'http://localhost:8080'
      }
    }
  }
})
