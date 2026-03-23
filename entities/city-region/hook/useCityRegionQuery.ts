import { useQuery } from '@tanstack/react-query';

import { getRegionsQuery } from '../api/city-region.api';
import { cityRegionQueryKeys } from '../model/city-region.query-keys';

interface IUseCityRegionQueryProps {
	enabled?: boolean;
}

export function useCityRegionQuery(props?: IUseCityRegionQueryProps) {
	const { enabled = true } = props ?? {};

	const query = useQuery({
		queryKey: cityRegionQueryKeys.region(),
		queryFn: getRegionsQuery,
		enabled,
		staleTime: 60_000,
	});

	return {
		...query,
		regions: query.data ?? [],
	};
}
