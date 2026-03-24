import React from 'react';

import { Appearance } from 'react-native';
import { useAtomValue, useSetAtom } from 'jotai';

import type { AppTheme } from '../../styles/tokens';
import { darkTheme, lightTheme } from '../../styles/tokens';

import type { ThemeMode } from './theme.store';
import { resolvedSchemeAtom, systemSchemeAtom, themeModeAtom } from './theme.store';

type ThemeContextValue = {
	theme: AppTheme;
	scheme: 'light' | 'dark';
	themeMode: ThemeMode;
	setThemeMode: (mode: ThemeMode) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const themeMode = useAtomValue(themeModeAtom);
	const scheme = useAtomValue(resolvedSchemeAtom);
	const setSystemScheme = useSetAtom(systemSchemeAtom);
	const setThemeMode = useSetAtom(themeModeAtom);

	React.useEffect(() => {
		const sub = Appearance.addChangeListener(({ colorScheme }) => {
			setSystemScheme(colorScheme === 'dark' ? 'dark' : 'light');
		});

		return () => sub.remove();
	}, [setSystemScheme]);

	const theme = scheme === 'dark' ? darkTheme : lightTheme;

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
