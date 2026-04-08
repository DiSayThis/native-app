import { studentsApi } from '@/shared/api/api-services';

interface ICreateReferralRewardRequestPayload {
	userId: string;
}

export async function createReferralRewardRequestQuery({
	userId,
}: ICreateReferralRewardRequestPayload): Promise<void> {
	if (!userId) {
		throw new Error('User id is required');
	}

	return studentsApi.post<void, { UserId: string }>('/ReferralRequest/createReferralRequest', {
		UserId: userId,
	});
}
