import { fileApi, studentsApi } from '@/shared/api/api-services';

import type {
	IUserAvatarUploadPayload,
	IUserCourseItemDto,
	IUserDictionaryItemDto,
	IUserProfileDto,
	IUserProfileUpdatePayload,
	IUserUniversityItemDto,
} from '../model/user.dto';

export async function getUserProfileQuery(studentId: string): Promise<IUserProfileDto> {
	if (!studentId) {
		throw new Error('Student id is required');
	}

	return studentsApi.get<IUserProfileDto>('/Students', { Id: studentId });
}

export async function updateUserProfileQuery(
	studentId: string,
	payload: IUserProfileUpdatePayload,
): Promise<void> {
	if (!studentId) {
		throw new Error('Student id is required');
	}

	return studentsApi.put<void, IUserProfileUpdatePayload>(`/Students/${studentId}`, payload);
}

export async function uploadUserAvatarQuery(payload: IUserAvatarUploadPayload): Promise<void> {
	if (!payload.id) {
		throw new Error('Student id is required');
	}

	return fileApi.post<void, IUserAvatarUploadPayload>('/Avatars', payload);
}

export async function getUserUniversitiesQuery(): Promise<IUserUniversityItemDto[]> {
	return studentsApi
		.get<IUserUniversityItemDto[]>('/Universities')
		.then((data) => (Array.isArray(data) ? data : []))
		.catch(() => []);
}

export async function getUserCoursesQuery(): Promise<IUserCourseItemDto[]> {
	return studentsApi
		.get<IUserCourseItemDto[]>('/Courses')
		.then((data) => (Array.isArray(data) ? data : []))
		.catch(() => []);
}

export async function getUserCitiesQuery(regionId?: number): Promise<IUserDictionaryItemDto[]> {
	const params = regionId ? { RegionId: regionId } : undefined;

	return studentsApi
		.get<IUserDictionaryItemDto[]>('/Cities', params)
		.then((data) => (Array.isArray(data) ? data : []))
		.catch(() => []);
}
