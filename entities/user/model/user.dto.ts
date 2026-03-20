import type RolesEnum from '@/shared/constants/rolesEnum';

export interface IUserDto {
	id: string;
	email: string;
	role: RolesEnum;
	error?: string;
}

export interface IUserProfileDto {
	id: string;
	email?: string;
	firstName?: string;
	lastName?: string;
}
