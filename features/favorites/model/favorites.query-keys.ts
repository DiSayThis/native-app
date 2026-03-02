export const favoritesQueryKeys = {
	base: ['favorites'] as const,
	partners: (studentId: string) => [...favoritesQueryKeys.base, 'partners', studentId] as const,
};
