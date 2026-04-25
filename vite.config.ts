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
      // 认证相关 API 代理到后端，去掉 /api-auth 前缀
      '/api-auth': {
        target: 'http://localhost:5577',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-auth/, ''),
      },
      // MC 服务 API 代理到后端，去掉 /api-mc 前缀
      '/api-mc': {
        target: 'http://localhost:5599',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-mc/, ''),
      },
    },
  },
})

export default config
