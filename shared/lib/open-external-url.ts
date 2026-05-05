import { Linking } from 'react-native';

import * as WebBrowser from 'expo-web-browser';

function normalizeExternalUrl(url: string) {
	const normalizedUrl = url.trim();

	if (!normalizedUrl) {
		return null;
	}

	if (/^[a-z][a-z0-9+.-]*:/i.test(normalizedUrl)) {
		return normalizedUrl;
	}

	return `https://${normalizedUrl}`;
}

export async function openExternalUrl(url: string) {
	const normalizedUrl = normalizeExternalUrl(url);

	if (!normalizedUrl) {
		return;
	}

	if (normalizedUrl.startsWith('http://') || normalizedUrl.startsWith('https://')) {
		await WebBrowser.openBrowserAsync(normalizedUrl);
		return;
	}

	await Linking.openURL(normalizedUrl);
}
