import { useQuery } from '@tanstack/react-query';

import { getFavoritePartnersQuery } from '../api/favorites.api';
import { favoritesQueryKeys } from '../model/favorites.query-keys';

export function useFavoritesData(studentId: string | null) {
	const partnersQuery = useQuery({
		queryKey: favoritesQueryKeys.partners(studentId ?? ''),
		queryFn: () => getFavoritePartnersQuery(studentId ?? ''),
		enabled: Boolean(studentId),
	});

	return {
		partners: partnersQuery.data ?? [],
		isLoading: partnersQuery.isLoading,
		isError: partnersQuery.isError,
		refetch: async () => {
			await partnersQuery.refetch();
		},
	};
}
