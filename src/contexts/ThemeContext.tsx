import { createContext, useContext, useEffect } from 'react'
import { useSettings } from '../hooks/useLocalStorage'

interface ThemeContextType {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useSettings()

  const setTheme = (theme: 'light' | 'dark') => {
    setSettings(prev => ({ ...prev, theme }))
  }

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement
    if (settings.theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [settings.theme])

  return (
    <ThemeContext.Provider value={{ theme: settings.theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}