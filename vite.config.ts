import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-vite-plugin'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [tanstackRouter(), devtools(), tailwindcss(), viteReact()],
  server: {
    proxy: {
      // AJAX API 请求代理到后端，避免 CORS
      '/api': {
        target: 'http://localhost:5577',
        changeOrigin: true,
      },
    },
  },
})

export default config
