import type * as DocumentPicker from 'expo-document-picker';

export interface IUniversityDTO {
	id: number;
	name: string;
	shortName?: string;
}

export interface ICourseDTO {
	id: number;
	name: string;
	yearsBeforeEnding?: number;
}

export type RegistrationFile = DocumentPicker.DocumentPickerAsset | null;

export interface IStudentDTO {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
}

export interface IRegistrationFormType {
	email: string;
	password: string;
	confirmPassword: string;
	promocode?: string;
	firstName: string;
	lastName: string;
	sex?: boolean;
	birthDate: string;
	specialisation: string;
	universityId?: number;
	courseId?: number;
	file?: RegistrationFile;
	consent: boolean;
}
