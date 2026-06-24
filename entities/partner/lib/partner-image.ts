import { FILE_API } from '@/shared/api/urls';

export const PARTNER_IMAGE_CACHE_TTL_MS = 60 * 60 * 1000;

export function getPartnerImageCacheBucket(timestamp = Date.now()) {
	return Math.floor(timestamp / PARTNER_IMAGE_CACHE_TTL_MS);
}

export function getPartnerImageMsUntilNextRefresh(timestamp = Date.now()) {
	const elapsedInBucket = timestamp % PARTNER_IMAGE_CACHE_TTL_MS;
	return PARTNER_IMAGE_CACHE_TTL_MS - elapsedInBucket;
}

export function buildPartnerImageUri(
	partnerId: string,
	cacheBucket = getPartnerImageCacheBucket(),
) {
	return `${FILE_API}/Partners/${partnerId}?v=${cacheBucket}`;
}
