import AsyncStorage from '@react-native-async-storage/async-storage';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

export interface IAuthStore {
	access_token: string | null;
	isLoading: boolean;
	error: string | null;
}

const authStorage = createJSONStorage<IAuthStore>(() => AsyncStorage);

export const authAtom = atomWithStorage<IAuthStore>(
	'auth',
	{
		access_token: null,
		isLoading: false,
		error: null,
	},
	authStorage,
);
