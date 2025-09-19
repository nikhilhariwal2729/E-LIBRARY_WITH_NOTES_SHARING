import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTheme = create(
  persist(
    (set) => ({
      isDarkMode: false,
      
      toggleDarkMode: () => {
        set((state) => ({ isDarkMode: !state.isDarkMode }));
      },
      
      setDarkMode: (isDark) => {
        set({ isDarkMode: isDark });
      }
    }),
    {
      name: 'theme-storage',
    }
  )
);

export default useTheme;
