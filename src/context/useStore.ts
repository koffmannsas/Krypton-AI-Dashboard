import { create } from 'zustand';

interface AppState {
  user: any;
  companyId: string;
  darkMode: boolean;
  wordpressConfig: {
    url: string;
    username: string;
    appPassword: string;
  };
  setUser: (user: any) => void;
  setCompanyId: (companyId: string) => void;
  toggleDarkMode: () => void;
  setWordPressConfig: (config: AppState['wordpressConfig']) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  companyId: 'default-company',
  darkMode: true,
  wordpressConfig: {
    url: '',
    username: '',
    appPassword: ''
  },
  setUser: (user) => set({ user }),
  setCompanyId: (companyId) => set({ companyId }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  setWordPressConfig: (wordpressConfig) => set({ wordpressConfig }),
}));
