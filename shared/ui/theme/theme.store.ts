import { Appearance, type ColorSchemeName } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

export type ThemeMode = 'system' | 'light' | 'dark';
type ResolvedScheme = 'light' | 'dark';

const normalizeScheme = (scheme?: ColorSchemeName | null): ResolvedScheme =>
	scheme === 'dark' ? 'dark' : 'light';

const themeModeStorage = createJSONStorage<ThemeMode>(() => AsyncStorage);

export const themeModeAtom = atomWithStorage<ThemeMode>('app-theme', 'system', themeModeStorage);
export const systemSchemeAtom = atom<ResolvedScheme>(normalizeScheme(Appearance.getColorScheme()));
export const resolvedSchemeAtom = atom<ResolvedScheme>((get) => {
	const themeMode = get(themeModeAtom) as ThemeMode;
	const systemScheme = get(systemSchemeAtom);

	return themeMode === 'system' ? systemScheme : themeMode;
});
