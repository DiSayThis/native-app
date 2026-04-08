import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

import type { IUserDto } from './user.dto';

export interface IUserStore {
	user: IUserDto | null;
	isLoading: boolean;
	error: string | null;
}

export const userAtom = atom<IUserStore>({
	user: null,
	isLoading: false,
	error: null,
});

const userAvatarVersionStorage = createJSONStorage<Record<string, number>>(() => AsyncStorage);

export const userAvatarVersionAtom = atomWithStorage<Record<string, number>>(
	'user-avatar-version',
	{},
	userAvatarVersionStorage,
);

export const bumpUserAvatarVersionAtom = atom(
	null,
	(get, set, studentId: string | null | undefined) => {
		if (!studentId) return;

		set(userAvatarVersionAtom, {
			...get(userAvatarVersionAtom),
			[studentId]: Date.now(),
		});
	},
);
