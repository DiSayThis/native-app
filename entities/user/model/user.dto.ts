import type RolesEnum from '@/shared/constants/rolesEnum';

export interface IUserDto {
	id: string;
	email: string;
	role: RolesEnum;
	error?: string;
}

export interface IUserProfilePaymentInformationDto {
	inn: number;
	bik: string;
	accountNumber: string;
	patronymic: string;
}

export interface IUserDictionaryItemDto {
	id: number;
	name: string;
}

export interface IUserUniversityItemDto extends IUserDictionaryItemDto {
	shortName?: string;
}

export interface IUserCourseItemDto extends IUserDictionaryItemDto {
	yearsBeforeEnding?: number;
}

export interface IUserProfileDto {
	id: string;
	email?: string;
	firstName?: string;
	lastName?: string;
	sex?: boolean;
	birthDate?: string;
	specialisation?: string;
	status?: number | null;
	hasWork?: boolean;
	balance?: number;
	promocode?: string;
	course?: {
		id: number;
		name?: string;
		yearsBeforeEnding?: number;
	} | null;
	university?: {
		id: number;
		name?: string;
		shortName?: string;
	} | null;
	region?: {
		id: number;
		name?: string;
	} | null;
	city?: {
		id: number;
		name?: string;
	} | null;
	languages?: {
		id: number;
		name?: string;
	}[];
	paymentInformation?: IUserProfilePaymentInformationDto | null;
}

export interface IUserProfileUpdatePayload {
	id: string;
	firstName: string;
	lastName: string;
	sex: boolean;
	birthDate: string;
	email: string;
	specialisation: string;
	status: number | null;
	universityId: number;
	regionId: number | null;
	balance: number;
	hasWork: boolean;
	cityId: number | null;
	languageIds: number[];
	courseId: number;
	paymentInformation: IUserProfilePaymentInformationDto | null;
}

export interface IUserAvatarUploadPayload {
	id: string;
	image: string;
	contentType: string;
}
