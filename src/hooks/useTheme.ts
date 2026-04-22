import { useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'

export function useTheme() {
  const { theme, toggleTheme } = useThemeStore()

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('dark', 'light')
    root.classList.add(theme)
  }, [theme])

  return { theme, toggleTheme }
}
