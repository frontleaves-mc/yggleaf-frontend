import * as React from 'react'

type ThemeMode = 'light' | 'dark' | 'auto'

function useThemeMode() {
  const [mode, setMode] = React.useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'auto'
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark' || stored === 'auto')
      return stored
    return 'auto'
  })

  const applyTheme = React.useCallback((newMode: ThemeMode) => {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
    const resolved =
      newMode === 'auto' ? (prefersDark ? 'dark' : 'light') : newMode
    const root = document.documentElement

    root.classList.remove('light', 'dark')
    root.classList.add(resolved)

    if (newMode === 'auto') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', newMode)
    }

    root.style.colorScheme = resolved
    localStorage.setItem('theme', newMode)
  }, [])

  const changeMode = React.useCallback(
    (newMode: ThemeMode) => {
      setMode(newMode)
      applyTheme(newMode)
    },
    [applyTheme],
  )

  return { mode, changeMode }
}

export { useThemeMode, type ThemeMode }
