import { useQuery } from '@tanstack/react-query';

import { getFavoritePartnersQuery } from '../api/favorites.api';
import { favoritesQueryKeys } from '../model/favorites.query-keys';

const FAVORITES_STALE_TIME = 60_000;

export function useFavoritesData(studentId: string | null) {
	const partnersQuery = useQuery({
		queryKey: favoritesQueryKeys.partners(studentId ?? ''),
		queryFn: () => getFavoritePartnersQuery(studentId ?? ''),
		enabled: Boolean(studentId),
		staleTime: FAVORITES_STALE_TIME,
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
