export const partnersCardsQueryKeys = {
	base: ['partners-cards'] as const,
	categories: () => [...partnersCardsQueryKeys.base, 'categories'] as const,
	partners: () => [...partnersCardsQueryKeys.base, 'partners'] as const,
};
