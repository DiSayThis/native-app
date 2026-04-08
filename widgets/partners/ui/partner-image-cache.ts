import { FILE_API } from '@/shared/api/urls';

const readyPartnerImages = new Set<string>();

export function buildPartnerImageUri(partnerId: string) {
	return `${FILE_API}/Partners/${partnerId}`;
}

export function isPartnerImageReady(uri: string) {
	return readyPartnerImages.has(uri);
}

export function markPartnerImageReady(uri: string) {
	readyPartnerImages.add(uri);
}
