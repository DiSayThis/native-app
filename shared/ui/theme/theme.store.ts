// src/shared/theme/theme.store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance, type ColorSchemeName } from "react-native";

export type ThemeMode = "system" | "light" | "dark";

type ThemeState = {
  themeMode: ThemeMode;
  systemScheme: NonNullable<ColorSchemeName>; // "light" | "dark"
  setThemeMode: (mode: ThemeMode) => void;
  setSystemScheme: (scheme: ColorSchemeName) => void;
  getResolvedScheme: () => "light" | "dark";
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeMode: "light",
      systemScheme: Appearance.getColorScheme() ?? "light",

      setThemeMode: (mode) => set({ themeMode: mode }),
      setSystemScheme: (scheme) => set({ systemScheme: scheme ?? "light" }),
      getResolvedScheme: () => {
        const { themeMode, systemScheme } = get();
        if (themeMode === "system") return systemScheme;
        return themeMode;
      },
    }),
    {
      name: "app-theme",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ themeMode: state.themeMode }), // systemScheme не сохраняем
    },
  ),
);
