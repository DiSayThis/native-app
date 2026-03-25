export const userQueryKeys = {
	base: ['user'] as const,
	profile: (studentId?: string | null) =>
		[...userQueryKeys.base, 'profile', studentId ?? null] as const,
	universities: () => [...userQueryKeys.base, 'universities'] as const,
	courses: () => [...userQueryKeys.base, 'courses'] as const,
	cities: (regionId?: number) => [...userQueryKeys.base, 'cities', regionId ?? null] as const,
};
