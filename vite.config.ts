import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import string  from 'vite-plugin-string';

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
    viteExternalsPlugin({
      path: 'path',
    }),
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    string({
      include: ["**/*.jsona"],
      compress: false,
    }),
  ]
})
