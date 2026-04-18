import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import { TooltipProvider } from '#/components/ui/tooltip'
import { Toaster } from '#/components/ui/sonner'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
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
