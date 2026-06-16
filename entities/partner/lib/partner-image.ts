import { FILE_API } from '@/shared/api/urls';

export function buildPartnerImageUri(partnerId: string) {
	return `${FILE_API}/Partners/${partnerId}`;
}
