import { defineConfig } from 'vite'

export default defineConfig({
  base: '/slide/',
  define: {
    __API_URL__: JSON.stringify(
      process.env.NODE_ENV === 'production' 
        ? '/api'
        : 'http://localhost:8788/api'
    )
  },
})