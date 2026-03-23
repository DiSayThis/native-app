export const partnersCardsQueryKeys = {
	base: ['partners-cards'] as const,
	categories: () => [...partnersCardsQueryKeys.base, 'categories'] as const,
	partners: (regionId?: string | null) =>
		[...partnersCardsQueryKeys.base, 'partners', 'regionId', regionId ?? null] as const,
};
