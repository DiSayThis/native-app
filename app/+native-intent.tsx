import { normalizeIncomingDeepLink } from '@/shared/lib/deep-link/normalize-deep-link';

export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
	try {
		return normalizeIncomingDeepLink(path);
	} catch {
		return '/';
	}
}
