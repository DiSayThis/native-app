import { useQuery } from '@tanstack/react-query';

import { getPartnerDiscountsQuery, getPartnerOfferQuery } from '../api/partner-offer.api';
import { partnerOfferQueryKeys } from '../model/partner-offer.query-keys';

export function usePartnerOfferData(partnerId?: string, studentId?: string | null) {
	const isEnabled = Boolean(partnerId);
	const normalizedPartnerId = partnerId ?? '';

	const partnerQuery = useQuery({
		queryKey: partnerOfferQueryKeys.partner(normalizedPartnerId, studentId),
		queryFn: () => getPartnerOfferQuery(normalizedPartnerId, studentId),
		enabled: isEnabled,
	});

	const discountsQuery = useQuery({
		queryKey: partnerOfferQueryKeys.discounts(normalizedPartnerId),
		queryFn: () => getPartnerDiscountsQuery(normalizedPartnerId),
		enabled: isEnabled,
	});

	return {
		partner: partnerQuery.data,
		discounts: discountsQuery.data ?? [],
		isLoading: partnerQuery.isLoading || discountsQuery.isLoading,
		isError: partnerQuery.isError || discountsQuery.isError,
		refetch: async () => {
			await Promise.all([partnerQuery.refetch(), discountsQuery.refetch()]);
		},
	};
}
