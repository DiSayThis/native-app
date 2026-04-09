import { Image } from 'react-native';

export type CategoryIconType = 'svg' | 'raster' | 'unknown';

const svgXmlCache = new Map<string, string>();
const rasterReadyCache = new Set<string>();
const resolvedTypeCache = new Map<string, Exclude<CategoryIconType, 'unknown'>>();
const svgResolveInFlight = new Map<string, Promise<string | null>>();
const warmInFlight = new Map<string, Promise<void>>();
const SVG_DOC_RE =
	/^\s*(?:<\?xml[\s\S]*?\?>\s*)?(?:<!--[\s\S]*?-->\s*)*(?:<!DOCTYPE[\s\S]*?>\s*)?(?:<svg[\s\S]*<\/svg>|<svg[\s\S]*\/>)\s*$/i;

export function getCategoryIconType(url?: string): CategoryIconType {
	if (!url) {
		return 'unknown';
	}

	const resolvedType = resolvedTypeCache.get(url);
	if (resolvedType) {
		return resolvedType;
	}

	if (/^data:image\/svg\+xml/i.test(url) || /\.svg(?:\?|$)/i.test(url)) {
		return 'svg';
	}

	if (/^data:image\/(png|jpe?g|webp|gif|bmp|avif)/i.test(url)) {
		return 'raster';
	}

	if (/\.(png|jpe?g|webp|gif|bmp|avif)(?:\?|$)/i.test(url)) {
		return 'raster';
	}

	return 'unknown';
}

export function getCachedSvgXml(url?: string): string | null {
	if (!url) {
		return null;
	}

	const cached = svgXmlCache.get(url) ?? null;
	if (!cached) {
		return null;
	}

	if (!isSvgXmlDocument(cached)) {
		svgXmlCache.delete(url);
		return null;
	}

	return cached;
}

export function isRasterIconReady(url?: string): boolean {
	return Boolean(url && rasterReadyCache.has(url));
}

export function markRasterIconReady(url?: string): void {
	if (!url) {
		return;
	}

	resolvedTypeCache.set(url, 'raster');
	rasterReadyCache.add(url);
}

export async function resolveSvgXml(url: string): Promise<string | null> {
	const cached = svgXmlCache.get(url);
	if (cached) {
		if (!isSvgXmlDocument(cached)) {
			svgXmlCache.delete(url);
			resolvedTypeCache.delete(url);
		} else {
			resolvedTypeCache.set(url, 'svg');
			return cached;
		}
	}

	const inFlight = svgResolveInFlight.get(url);
	if (inFlight) {
		return inFlight;
	}

	const request = fetch(url)
		.then(async (response) => {
			if (!response.ok) {
				return null;
			}

			const contentType = (response.headers.get('content-type') ?? '').toLowerCase();
			if (
				contentType.includes('image/png') ||
				contentType.includes('image/jpeg') ||
				contentType.includes('image/jpg') ||
				contentType.includes('image/webp') ||
				contentType.includes('image/gif') ||
				contentType.includes('image/bmp') ||
				contentType.includes('image/avif')
			) {
				return null;
			}

			const xml = await response.text();
			if (!isSvgXmlDocument(xml)) {
				return null;
			}

			const normalizedXml = ensureSvgHasViewBox(xml);
			svgXmlCache.set(url, normalizedXml);
			resolvedTypeCache.set(url, 'svg');
			return normalizedXml;
		})
		.catch(() => null)
		.finally(() => {
			svgResolveInFlight.delete(url);
		});

	svgResolveInFlight.set(url, request);
	return request;
}

export async function warmCategoryIcon(url?: string): Promise<void> {
	if (!url) {
		return;
	}

	const inFlight = warmInFlight.get(url);
	if (inFlight) {
		return inFlight;
	}

	const request = (async () => {
		const type = getCategoryIconType(url);

		if (type === 'svg') {
			const svgXml = await resolveSvgXml(url);
			if (svgXml) {
				return;
			}

			const success = await Image.prefetch(url).catch(() => false);
			if (success) {
				markRasterIconReady(url);
			}
			return;
		}

		if (type === 'raster') {
			const success = await Image.prefetch(url).catch(() => false);
			if (success) {
				markRasterIconReady(url);
			}
			return;
		}

		const svgXml = await resolveSvgXml(url);
		if (svgXml) {
			return;
		}

		const success = await Image.prefetch(url).catch(() => false);
		if (success) {
			markRasterIconReady(url);
		}
	})().finally(() => {
		warmInFlight.delete(url);
	});

	warmInFlight.set(url, request);
	return request;
}

function ensureSvgHasViewBox(xml: string): string {
	const svgTagMatch = xml.match(/<svg\b[^>]*>/i);
	if (!svgTagMatch) {
		return xml;
	}

	const svgTag = svgTagMatch[0];
	if (/\bviewBox\s*=/i.test(svgTag)) {
		return xml;
	}

	const width = extractSvgDimension(svgTag, 'width');
	const height = extractSvgDimension(svgTag, 'height');
	if (!width || !height) {
		return xml;
	}

	const normalizedSvgTag = svgTag.replace('<svg', `<svg viewBox="0 0 ${width} ${height}"`);
	return xml.replace(svgTag, normalizedSvgTag);
}

function extractSvgDimension(svgTag: string, attribute: 'width' | 'height'): string | null {
	const regex = new RegExp(`\\b${attribute}\\s*=\\s*["']?([\\d.]+)(?:px)?["']?`, 'i');
	return svgTag.match(regex)?.[1] ?? null;
}

export function isSvgXmlDocument(value: string): boolean {
	const normalized = value.replace(/^\uFEFF/, '').trim();
	if (!normalized || normalized.includes('\u0000')) {
		return false;
	}

	return SVG_DOC_RE.test(normalized);
}
