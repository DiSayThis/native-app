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
