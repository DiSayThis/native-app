import { studentsApi } from '@/shared/api/api-services';

import type { IUserProfileDto } from '../model/user.dto';

export async function getUserProfileQuery(studentId: string): Promise<IUserProfileDto> {
	if (!studentId) {
		throw new Error('Student id is required');
	}

	return studentsApi.get<IUserProfileDto>('/Students', { Id: studentId });
}
