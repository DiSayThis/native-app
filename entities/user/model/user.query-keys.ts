export const userQueryKeys = {
	base: ['user'] as const,
	profile: (studentId?: string | null) =>
		[...userQueryKeys.base, 'profile', studentId ?? null] as const,
};
