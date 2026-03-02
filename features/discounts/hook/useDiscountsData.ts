import { useQuery } from '@tanstack/react-query';

import { getCategoriesQuery, getPartnersQuery } from '../api/discounts.api';
import { discountsQueryKeys } from '../model/discounts.query-keys';

export function useDiscountsData() {
	const categoriesQuery = useQuery({
		queryKey: discountsQueryKeys.categories(),
		queryFn: getCategoriesQuery,
	});

	const partnersQuery = useQuery({
		queryKey: discountsQueryKeys.partners(),
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
