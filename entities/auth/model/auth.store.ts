import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError } from 'axios';
import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

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
			console.log(response);

			set(authAtom, {
				id: response.id,
				role: response.role,
				isLoading: false,
				error: null,
			});
		} catch (error) {
			if (error instanceof AxiosError) {
				set(authAtom, {
					...INITIAL_STATE,
					error: error.response?.data?.message || 'Unknown error occurred',
				});
			}
		}
	},
);

export const logoutAtom = atom(null, async (get, set) => {
	set(authAtom, INITIAL_STATE);
});
