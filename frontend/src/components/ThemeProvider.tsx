import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

/**
 * ThemeProvider Component
 * Manages the global dark/light/system theme state. It saves the user's preference 
 * to localStorage and physically injects the 'dark' or 'light' CSS class into the HTML root.
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "agrivani-theme",
  ...props
}: ThemeProviderProps) {
  // Initialize theme from localStorage, falling back to the default
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  // This effect runs every time the theme changes
  useEffect(() => {
    const root = window.document.documentElement

    // 1. Wipe the slate clean
    root.classList.remove("light", "dark")

    // 2. If 'system', ask the browser/OS what the user prefers
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    // 3. Otherwise, force the selected theme
    root.classList.add(theme)
  }, [theme])

  // Wrap the setter to also save to localStorage automatically
  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}