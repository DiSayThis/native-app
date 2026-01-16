// src/shared/theme/ThemeProvider.tsx
import React from 'react';

import { Appearance } from 'react-native';

import type { AppTheme } from '../../styles/tokens';
import { lightTheme } from '../../styles/tokens';

import { useThemeStore } from './theme.store';

type ThemeContextValue = {
	theme: AppTheme;
	scheme: 'light' | 'dark';
	themeMode: 'system' | 'light' | 'dark';
	setThemeMode: (mode: 'system' | 'light' | 'dark') => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const themeMode = useThemeStore((s) => s.themeMode);
	const systemScheme = useThemeStore((s) => s.systemScheme);
	const setSystemScheme = useThemeStore((s) => s.setSystemScheme);
	const setThemeMode = useThemeStore((s) => s.setThemeMode);

	// 1) Подписка на смену системной темы
	React.useEffect(() => {
		const sub = Appearance.addChangeListener(({ colorScheme }) => {
			setSystemScheme((colorScheme ?? 'light') as 'light' | 'dark');
		});

		return () => sub.remove();
	}, [setSystemScheme]);

	// 2) Вычисляем итоговую схему
	const scheme: 'light' | 'dark' = themeMode === 'system' ? systemScheme : themeMode;

	const theme = scheme === 'dark' ? lightTheme : lightTheme;

	const value = React.useMemo(
		() => ({ theme, scheme, themeMode, setThemeMode }),
		[theme, scheme, themeMode, setThemeMode],
	);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
	const ctx = React.useContext(ThemeContext);
	if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
	return ctx;
}
