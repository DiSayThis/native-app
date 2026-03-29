import { useMutation } from '@tanstack/react-query';

import { sendSupportRequestQuery } from '../api/support-request.api';
import type { ISupportRequestPayload } from '../model/support-request.dto';

export function useSupportRequestMutation() {
	return useMutation({
		mutationFn: (payload: ISupportRequestPayload) => sendSupportRequestQuery(payload),
	});
}
