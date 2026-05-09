import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-vite-plugin'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routeFileIgnorePattern: '^components$',
    }),
    devtools(),
    tailwindcss(),
    viteReact(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5577',
        changeOrigin: true,
      },
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vendor-react',
              test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 30,
            },
            {
              name: 'vendor-tanstack',
              test: /node_modules[\\/]@tanstack[\\/]/,
              priority: 25,
            },
            {
              name: 'vendor-radix',
              test: /node_modules[\\/](radix-ui|@radix-ui)[\\/]/,
              priority: 20,
            },
            {
              name: 'vendor-markdown',
              test: /node_modules[\\/](react-markdown|remark-|rehype-|micromark|unified|mdast|hast|vfile|decode-named-character-reference|property-information|space-separated-tokens|comma-separated-tokens|trim-lines|unist-|bail|ccount|devlop|html-|zwitch)[\\/]/,
              priority: 18,
            },
            {
              name: 'vendor-motion',
              test: /node_modules[\\/](motion|framer-motion)[\\/]/,
              priority: 16,
            },
            {
              name: 'vendor-skinview',
              test: /node_modules[\\/](skinview3d|react-skinview3d|three)[\\/]/,
              priority: 15,
              maxSize: 350 * 1024,
            },
            {
              name: 'vendor-gallery',
              test: /node_modules[\\/](yet-another-react-lightbox|allotment)[\\/]/,
              priority: 14,
            },
            {
              name: 'vendor-core',
              test: /node_modules[\\/](axios|zod|jotai|sonner|cmdk|lucide-react|react-hook-form|@hookform|class-variance-authority|tailwind-merge|clsx)[\\/]/,
              priority: 13,
            },
            {
              name: 'vendor',
              test: /node_modules[\\/]/,
              priority: 1,
              maxSize: 450 * 1024,
            },
          ],
        },
      },
    },
  },
})

export default config
