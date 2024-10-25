import { writable } from 'svelte/store';

const createThemeStore = () => {
  // Initialize from localStorage if available
  const storedTheme = typeof window !== 'undefined' 
    ? localStorage.getItem('theme') ?? 'light'
    : 'light';

  const { subscribe, set } = writable<'light' | 'dark'>(storedTheme as 'light' | 'dark');

  subscribe(theme => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  });

  return {
    subscribe,
    toggleTheme: () => {
      subscribe(currentTheme => {
        set(currentTheme === 'light' ? 'dark' : 'light');
      });
    },
    setTheme: (theme: 'light' | 'dark') => set(theme)
  };
};

export const theme = createThemeStore();
