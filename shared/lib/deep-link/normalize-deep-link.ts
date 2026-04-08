const FALLBACK_ROUTE = '/';

const STUDENT_ACCOUNT_ROUTE_MAP: Record<string, string> = {
	'': '/profile',
	profile: '/profile',
	'edit-profile': '/student-edit-profile',
	'personal-info': '/student-edit-profile',
	'personal-data': '/student-edit-profile',
	'student-credentials': '/student-credentials',
	credentials: '/student-credentials',
	support: '/support-form',
	'support-form': '/support-form',
	'privacy-policy': '/privacy-policy',
	'cookies-policy': '/cookies-policy',
};

function safelyParsePath(path: string): URL | null {
	const normalizedInput = path.startsWith('/') ? path : `/${path}`;

	try {
		return new URL(path);
	} catch {
		try {
			return new URL(normalizedInput, 'https://studmart.app');
		} catch {
			return null;
		}
	}
}

function normalizePathname(pathname: string) {
	const decodedPath = decodeURIComponent(pathname.trim());

	if (!decodedPath || decodedPath === '/') {
		return '/';
	}

	return decodedPath.replace(/\/+$/, '') || '/';
}

function withSearch(pathname: string, search: string) {
	return search ? `${pathname}${search}` : pathname;
}

export function normalizeIncomingDeepLink(path: string) {
	const parsedUrl = safelyParsePath(path);

	if (!parsedUrl) {
		return FALLBACK_ROUTE;
	}

	const rawPathname =
		parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:' && parsedUrl.host
			? `/${parsedUrl.host}${parsedUrl.pathname}`
			: parsedUrl.pathname;
	const pathname = normalizePathname(rawPathname);

	if (pathname === '/' || pathname === '/registration' || pathname === '/login') {
		return withSearch(pathname, parsedUrl.search);
	}

	if (pathname === '/login/reset-password') {
		return withSearch('/reset-password', parsedUrl.search);
	}

	if (pathname.startsWith('/partner-offer/')) {
		const partnerId = pathname.split('/').filter(Boolean)[1];

		return partnerId ? withSearch(`/partner-offer/${partnerId}`, parsedUrl.search) : FALLBACK_ROUTE;
	}

	if (pathname === '/student-personal-account') {
		return withSearch('/profile', parsedUrl.search);
	}

	if (pathname.startsWith('/student-personal-account/')) {
		const accountSection = pathname.replace('/student-personal-account/', '');
		const normalizedSection = accountSection.split('/').filter(Boolean)[0] ?? '';

		return withSearch(STUDENT_ACCOUNT_ROUTE_MAP[normalizedSection] ?? '/profile', parsedUrl.search);
	}

	return withSearch(pathname, parsedUrl.search);
}
