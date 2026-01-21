import type RolesEnum from '@/shared/constants/rolesEnum';

export interface IUserDto {
	id: string;
	email: string;
	role: RolesEnum;
	error?: string;
}
