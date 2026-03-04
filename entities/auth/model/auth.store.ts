import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError } from 'axios';
import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

import { getAxiosErrorMessage } from '@/shared/lib/get-axios-error-message';

import { authQueries } from '../api/query';

import type { ILoginPayload } from './auth.dto';

export interface IAuthStore {
	id: string | null;
	role: string | null;
	isLoading: boolean;
	error: string | null;
}
const INITIAL_STATE: IAuthStore = {
	id: null,
	role: null,
	isLoading: false,
	error: null,
};
const authStorage = createJSONStorage<IAuthStore>(() => AsyncStorage);

export const authAtom = atomWithStorage<IAuthStore>('auth', INITIAL_STATE, authStorage);

export const loginAtom = atom(
	(get) => get(authAtom),
	async (get, set, { email, password }: ILoginPayload) => {
		set(authAtom, { ...INITIAL_STATE, isLoading: true });
		try {
			const response = await authQueries.login({ email, password });
			const userId = response.id ?? response.user?.id ?? null;
			const userRole = response.role ?? response.user?.role ?? null;
			const accessToken = response.accessToken ?? response.token ?? null;

			if (!userId || !userRole) {
				throw new Error('Некорректный ответ авторизации');
			}

			if (accessToken) {
				await AsyncStorage.setItem('accessToken', accessToken);
			}

			set(authAtom, {
				id: userId,
				role: userRole,
				isLoading: false,
				error: null,
			});
			return { success: true as const, error: null };
		} catch (error) {
			if (error instanceof AxiosError) {
				const message = getAxiosErrorMessage(error);
				set(authAtom, {
					...INITIAL_STATE,
					error: message,
				});
				return { success: false as const, error: message };
			}

			set(authAtom, {
				...INITIAL_STATE,
				error: 'Ошибка авторизации',
			});
			return { success: false as const, error: 'Ошибка авторизации' };
		}
	},
);

export const logoutAtom = atom(null, async (get, set) => {
	await AsyncStorage.removeItem('accessToken');
	set(authAtom, INITIAL_STATE);
});
