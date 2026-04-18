import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'

import { getRouter } from './router'
import { getContext } from './integrations/tanstack-query/root-provider'
import './styles.css'

function applyInitialTheme() {
  try {
    const stored = window.localStorage.getItem('theme')
    const mode = stored === 'light' || stored === 'dark' || stored === 'auto' ? stored : 'auto'
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const resolved = mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode
    const root = document.documentElement

    root.classList.remove('light', 'dark')
    root.classList.add(resolved)

    if (mode === 'auto') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', mode)
    }

    root.style.colorScheme = resolved
  } catch {
    // ignore theme bootstrap failures
  }
}

const router = getRouter()
const { queryClient } = getContext()

applyInitialTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
