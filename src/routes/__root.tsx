import {
  Outlet,
  createRootRouteWithContext
  
} from '@tanstack/react-router'
import type {ErrorComponentProps} from '@tanstack/react-router';

import { TooltipProvider } from '#/components/ui/tooltip'
import { Toaster } from '#/components/ui/sonner'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

function ErrorFallback({ error }: ErrorComponentProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground">页面加载出错</h2>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground cursor-pointer"
        >
          刷新页面
        </button>
      </div>
    </div>
  )
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  errorComponent: ErrorFallback,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground">页面未找到</h2>
        <p className="mt-2 text-sm text-muted-foreground">您访问的页面不存在</p>
      </div>
    </div>
  ),
})

function RootComponent() {
  return (
    <TooltipProvider>
      <div className="font-sans antialiased [overflow-wrap:anywhere]">
        <Outlet />
      </div>
      <Toaster />
    </TooltipProvider>
  )
}
