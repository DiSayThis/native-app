export const partnerOfferQueryKeys = {
	base: ['partner-offer'] as const,
	partner: (partnerId: string, studentId?: string | null) =>
		[...partnerOfferQueryKeys.base, 'partner', partnerId, studentId ?? null] as const,
	discounts: (partnerId: string) =>
		[...partnerOfferQueryKeys.base, 'discounts', partnerId] as const,
};
