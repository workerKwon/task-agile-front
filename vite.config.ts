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
        target: 'http://localhost:8080',
        ws: true
      },
      '^/local-file/': {
        target: 'http://localhost:8080'
      }
    }
  },
  resolve: {
    alias: {
      eventsource:
        './node_modules/sockjs-client/lib/transport/browser/eventsource.js',
      events: './node_modules/sockjs-client/lib/event/emitter.js',
      crypto: './node_modules/sockjs-client/lib/utils/browser-crypto.js'
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      }
    }
  }
})
