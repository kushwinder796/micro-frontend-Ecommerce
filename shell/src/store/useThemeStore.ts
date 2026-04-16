import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "dark" | "midnight";

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  cycleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "dark",
      setMode: (mode) => set({ mode }),
      cycleTheme: () => {
        const modes: ThemeMode[] = ["dark", "midnight"];
        const current = get().mode;
        const nextIndex = (modes.indexOf(current) + 1) % modes.length;
        set({ mode: modes[nextIndex] });
      },
    }),
    {
      name: "theme-storage",
    }
  )
);
