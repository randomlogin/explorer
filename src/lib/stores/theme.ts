import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark' | 'system';

function createThemeStore() {
  // Initialize theme from localStorage or default to system
  const initialTheme = (browser ? localStorage.getItem('theme') : null) as Theme ?? 'system';
  const theme = writable<Theme>(initialTheme);
  
  // Create a derived store that always reflects the actual theme (light/dark)
  const effectiveTheme = derived(theme, ($theme, set) => {
    if (!browser) return set('light');
    
    if ($theme === 'system') {
      // Watch for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const updateTheme = () => {
        set(mediaQuery.matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', mediaQuery.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', updateTheme);
      updateTheme();
      
      return () => mediaQuery.removeEventListener('change', updateTheme);
    } else {
      set($theme);
      document.documentElement.setAttribute('data-theme', $theme);
    }
  });

  // Return store with additional methods
  return {
    subscribe: theme.subscribe,
    effectiveTheme: effectiveTheme,
    set: (value: Theme) => {
      if (browser) {
        if (value === 'system') {
          localStorage.removeItem('theme');
        } else {
          localStorage.setItem('theme', value);
        }
      }
      theme.set(value);
    },
    update: theme.update
  };
}

export const themeStore = createThemeStore();
