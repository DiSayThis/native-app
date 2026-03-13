import { useQuery } from '@tanstack/react-query';

import { getCategoriesQuery, getPartnersQuery } from '../api/partners-cards.api';
import { partnersCardsQueryKeys } from '../model/partners-cards.query-keys';

export function usePartnersCardsData() {
	const categoriesQuery = useQuery({
		queryKey: partnersCardsQueryKeys.categories(),
		queryFn: getCategoriesQuery,
	});

	const partnersQuery = useQuery({
		queryKey: partnersCardsQueryKeys.partners(),
		queryFn: getPartnersQuery,
	});

	return {
		categories: categoriesQuery.data ?? [],
		partners: partnersQuery.data ?? [],
		isLoading: categoriesQuery.isLoading || partnersQuery.isLoading,
		isError: categoriesQuery.isError || partnersQuery.isError,
		refetch: async () => {
			await Promise.all([categoriesQuery.refetch(), partnersQuery.refetch()]);
		},
	};
}
