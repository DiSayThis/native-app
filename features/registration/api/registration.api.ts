import { STUDENTS_API } from '@/shared/api/urls';
import { axiosCore } from '@/shared/lib/axios';

import type {
	ICourseDTO,
	IRegistrationFormType,
	IStudentDTO,
	IUniversityDTO,
} from '../model/registration.dto';

export const getStudentByEmailQuery = async (email: string): Promise<IStudentDTO | null> => {
	try {
		return await axiosCore
			.get<IStudentDTO>(`${STUDENTS_API}/Students`, { params: { Email: email } })
			.then((res) => res.data);
	} catch {
		return null;
	}
};

export const getUniversitiesQuery = async (): Promise<IUniversityDTO[]> => {
	return axiosCore.get<IUniversityDTO[]>(`${STUDENTS_API}/Universities`).then((res) =>
		res.data.map((item) => ({
			...item,
			id: Number(item.id),
		})),
	);
};

export const getCourseQuery = async (): Promise<ICourseDTO[]> => {
	return axiosCore.get<ICourseDTO[]>(`${STUDENTS_API}/Courses`).then((res) => res.data);
};

export const getCheckEmailDomainsQuery = async (
	email: string,
	universityId: number,
): Promise<boolean> => {
	try {
		const response = await axiosCore.get(`${STUDENTS_API}/EmailDomains`, {
			params: { Email: email, UniversityId: universityId },
		});
		return response.status === 204;
	} catch {
		return false;
	}
};

export const registerStudentQuery = async (data: IRegistrationFormType) => {
	const formData = new FormData();
	const {
		file,
		consent,
		confirmPassword,
		promocode,
		email,
		password,
		firstName,
		lastName,
		sex,
		birthDate,
		specialisation,
		universityId,
		courseId,
	} = data;

	formData.append('email', email);
	formData.append('password', password);
	formData.append('confirmPassword', confirmPassword);
	formData.append('promocode', promocode ?? '');
	formData.append('firstName', firstName);
	formData.append('lastName', lastName);
	formData.append('sex', String(Boolean(sex)));
	formData.append('birthDate', birthDate);
	formData.append('specialisation', specialisation);
	formData.append('universityId', String(universityId));
	formData.append('courseId', String(courseId));
	formData.append('consent', String(consent));

	if (file?.uri) {
		formData.append('file', {
			uri: file.uri,
			type: file.mimeType || 'image/jpeg',
			name: file.name || 'verification.jpg',
		} as any);
	}

	return axiosCore.post(`${STUDENTS_API}/Students`, formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});
};
