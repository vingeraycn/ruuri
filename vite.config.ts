import typescript from '@rollup/plugin-typescript'
import reactRefresh from '@vitejs/plugin-react-refresh'
import path from 'path'
import { defineConfig } from 'vite'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), typescript()],
  esbuild: {
    jsxFactory: 'jsx',
    jsxInject: `
      import React from 'react'  
      import { jsx } from '@emotion/react'
    `,
  },
  build: {
    lib: {
      name: pkg.name,
      formats: ['es', 'cjs'],
      entry: path.resolve(__dirname, 'src/index.ts'),
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'muuri'],
    },
  },
})
