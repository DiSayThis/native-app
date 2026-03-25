import { useQuery } from '@tanstack/react-query';

import { getUserCitiesQuery, getUserCoursesQuery, getUserUniversitiesQuery } from '../api/query';
import { userQueryKeys } from '../model/user.query-keys';

type UseUserProfileFormDictionariesProps = {
	regionId?: number;
	enabled?: boolean;
};

export function useUserProfileFormDictionaries(props?: UseUserProfileFormDictionariesProps) {
	const { regionId, enabled = true } = props ?? {};
	const isCitiesEnabled = enabled && typeof regionId === 'number';

	const universitiesQuery = useQuery({
		queryKey: userQueryKeys.universities(),
		queryFn: getUserUniversitiesQuery,
		enabled,
	});

	const coursesQuery = useQuery({
		queryKey: userQueryKeys.courses(),
		queryFn: getUserCoursesQuery,
		enabled,
	});

	const citiesQuery = useQuery({
		queryKey: userQueryKeys.cities(regionId),
		queryFn: () => getUserCitiesQuery(regionId),
		enabled: isCitiesEnabled,
	});

	return {
		universitiesQuery,
		coursesQuery,
		citiesQuery,
	};
}
