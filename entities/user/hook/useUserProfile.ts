import { useQuery } from '@tanstack/react-query';

import { getUserProfileQuery } from '../api/query';
import { userQueryKeys } from '../model/user.query-keys';

export function useUserProfile(studentId?: string | null) {
	const query = useQuery({
		queryKey: userQueryKeys.profile(studentId),
		queryFn: () => getUserProfileQuery(studentId ?? ''),
		enabled: Boolean(studentId),
		staleTime: 60_000,
	});

	return {
		...query,
		profile: query.data,
	};
}
