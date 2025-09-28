import * as React from "react"

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: string
  storageKey?: string
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Initialize theme on mount
  React.useEffect(() => {
    const theme = localStorage.getItem('theme') || 'system'
    const root = window.document.documentElement
    
    const applyTheme = (themeName: 'light' | 'dark') => {
      root.classList.remove('light', 'dark')
      root.classList.add(themeName)
    }

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      applyTheme(systemTheme)
    } else {
      applyTheme(theme as 'light' | 'dark')
    }
  }, [])

  return <>{children}</>
}