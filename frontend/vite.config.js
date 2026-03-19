import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom plugin to remove React DevTools warning
function removeReactDevToolsWarning() {
  return {
    name: 'remove-react-devtools-warning',
    transform(code, id) {
      // Remove the React DevTools warning message
      const warningMessage = 'Download the React DevTools for a better development experience'
      const warningUrl = 'https://reactjs.org/link/react-devtools'
      
      if (code.includes(warningMessage) || code.includes(warningUrl)) {
        // Replace the warning with an empty string
        return code
          .replace(new RegExp(warningMessage, 'g'), '')
          .replace(new RegExp(warningUrl, 'g'), '')
          .replace(/console\.warn\([^)]*React DevTools[^)]*\)/g, '')
      }
      return code
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    removeReactDevToolsWarning()
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:62822',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})
