import { useMutation } from '@tanstack/react-query';

import { createReferralRewardRequestQuery } from '../api/referral-program.api';

export function useReferralRewardRequestMutation() {
	return useMutation({
		mutationFn: createReferralRewardRequestQuery,
	});
}
