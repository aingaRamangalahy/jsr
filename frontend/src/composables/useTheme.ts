import { ref, onMounted, watch } from 'vue'

type Theme = 'light' | 'dark' | 'system'

export function useTheme() {
  const theme = ref<Theme>('system')

  // Get system theme preference
  const getSystemTheme = (): Theme => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // Update DOM with theme class
  const updateTheme = (value: Theme) => {
    const html = document.documentElement
    const isDark = value === 'dark' || (value === 'system' && getSystemTheme() === 'dark')
    
    html.classList.remove('light', 'dark')
    html.classList.add(isDark ? 'dark' : 'light')
  }

  // Set theme and save to localStorage
  const setTheme = (value: Theme) => {
    theme.value = value
    localStorage.setItem('theme', value)
    updateTheme(value)
  }

  // Watch for system theme changes
  onMounted(() => {
    // Get initial theme from localStorage or default to system
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      setTheme('system')
    }

    // Watch for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      if (theme.value === 'system') {
        updateTheme('system')
      }
    })
  })

  // Watch for theme changes
  watch(theme, (newTheme) => {
    updateTheme(newTheme)
  })

  return {
    theme,
    setTheme
  }
}
