import { atom } from 'jotai';

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

export const userAvatarVersionAtom = atom<Record<string, number>>({});

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
