export const discountsQueryKeys = {
	base: ['discounts'] as const,
	categories: () => [...discountsQueryKeys.base, 'categories'] as const,
	partners: () => [...discountsQueryKeys.base, 'partners'] as const,
};
