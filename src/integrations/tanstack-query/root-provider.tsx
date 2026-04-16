import { QueryClient } from '@tanstack/react-query'
import { setQueryClientRef } from '#/api/client'

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // 5 分钟内数据视为新鲜
        staleTime: 5 * 60 * 1000,
        // 失败后不自动重试（避免 401 时反复触发刷新）
        retry: (failureCount, error) => {
          if (error?.message?.includes('401') || error?.message?.includes('登录已过期')) {
            return false
          }
          return failureCount < 2
        },
        // 请求失败后不自动 refetch
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

  // 注册模块级引用，供 API Client 响应拦截器使用
  setQueryClientRef(queryClient)

  return {
    queryClient,
  }
}
export default function TanstackQueryProvider() {}
