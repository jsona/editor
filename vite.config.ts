import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/editor/',
  optimizeDeps: {
    exclude: [
      "@jsona/core",
      "@jsona/openapi",
      "@jsona/schema",
    ]
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ]
})
