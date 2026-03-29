import { supportEmailApi } from '@/shared/api/api-services';

import type { ISupportRequestPayload } from '../model/support-request.dto';

export async function sendSupportRequestQuery(payload: ISupportRequestPayload): Promise<unknown> {
	if (!payload.name || !payload.body || !payload.from) {
		throw new Error('Все поля формы должны быть заполнены');
	}

	return supportEmailApi.post<unknown, ISupportRequestPayload>('/SupportRequest', payload);
}
