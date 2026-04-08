import { normalizeIncomingDeepLink } from './normalize-deep-link';

describe('normalizeIncomingDeepLink', () => {
	it.each([
		['/', '/'],
		['https://studmart.ru/', '/'],
		['https://studmart.ru/login', '/login'],
		['https://studmart.ru/registration', '/registration'],
		['https://studmart.ru/registration?promocode=WELCOME2026', '/registration?promocode=WELCOME2026'],
		[
			'https://studmart.ru/login/reset-password?Email=test%40mail.com&ResetCode=abc123',
			'/reset-password?Email=test%40mail.com&ResetCode=abc123',
		],
		['https://studmart.ru/partner-offer/42', '/partner-offer/42'],
		['studmart-native-app-scheme://partner-offer/77', '/partner-offer/77'],
		['https://studmart.ru/student-personal-account', '/profile'],
		['https://studmart.ru/student-personal-account/edit-profile', '/student-edit-profile'],
		['https://studmart.ru/student-personal-account/credentials', '/student-credentials'],
		['https://studmart.ru/student-personal-account/support', '/support-form'],
		['https://studmart.ru/student-personal-account/privacy-policy', '/privacy-policy'],
		['https://studmart.ru/student-personal-account/cookies-policy', '/cookies-policy'],
		['https://studmart.ru/student-personal-account/unknown', '/profile'],
	])('maps %s to %s', (incomingPath, expectedPath) => {
		expect(normalizeIncomingDeepLink(incomingPath)).toBe(expectedPath);
	});
});
