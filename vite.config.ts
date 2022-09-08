import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import string  from 'vite-plugin-string';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/editor/',
  plugins: [
    wasm(),
    topLevelAwait(),
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
    })
  ]
})
