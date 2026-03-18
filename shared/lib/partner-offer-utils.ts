export function normalizeRichText(value?: string) {
	if (!value) {
		return '';
	}

	return value
		.replace(/!\[.*?\]\(.*?\)/g, '')
		.replace(/\[(.*?)\]\(.*?\)/g, '$1')
		.replace(/<[^>]+>/g, ' ')
		.replace(/[#*_`>|-]/g, ' ')
		.replace(/\r?\n+/g, ' ')
		.replace(/\s{2,}/g, ' ')
		.trim();
}

export function formatDiscountSize(size?: number) {
	if (typeof size !== 'number' || Number.isNaN(size)) {
		return null;
	}

	if (Number.isInteger(size)) {
		return `${size}%`;
	}

	return `${size.toString().replace('.', ',')}%`;
}

export function normalizeSiteUrl(site?: string) {
	if (!site) {
		return null;
	}

	if (site.startsWith('http://') || site.startsWith('https://')) {
		return site;
	}

	return `https://${site}`;
}
