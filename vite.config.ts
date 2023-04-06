import typescript from '@rollup/plugin-typescript'
import react from '@vitejs/plugin-react'
import path from 'path'
import visualizer from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    typescript({
      tsconfig: 'tsconfig.json',
      rootDir: 'src',
    }),
    visualizer({
      brotliSize: true,
      gzipSize: true,
    }),
  ],
  esbuild: {
    jsxFactory: 'jsx',
    jsxInject: `
      import React from 'react'  
    `,
  },
  build: {
    lib: {
      name: pkg.name,
      formats: ['es', 'cjs'],
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'muuri'],
      output: {
        dir: './dist',
        exports: 'named',
        globals: {
          muuri: 'muuri',
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})
