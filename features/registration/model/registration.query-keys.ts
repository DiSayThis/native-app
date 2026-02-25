export const registrationQueryKeys = {
	base: ['registration'] as const,
	emailCheck: (email: string) => [...registrationQueryKeys.base, 'email-check', email] as const,
	universities: () => [...registrationQueryKeys.base, 'universities'] as const,
	courses: () => [...registrationQueryKeys.base, 'courses'] as const,
};
