import * as React from 'react'

const STORAGE_KEY = 'darkMode'

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = React.useState(false)

  React.useEffect(() => {
    // Read from localStorage on mount (client-side only)
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored !== null) {
        setIsDarkMode(JSON.parse(stored))
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setIsDarkMode(prefersDark)
      }
    } catch {}
  }, [])

  const toggleDarkMode = React.useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {}

      // Update body classes
      if (next) {
        document.body.classList.add('dark-mode')
        document.body.classList.remove('light-mode')
      } else {
        document.body.classList.add('light-mode')
        document.body.classList.remove('dark-mode')
      }
      return next
    })
  }, [])

  return { isDarkMode, toggleDarkMode }
}
