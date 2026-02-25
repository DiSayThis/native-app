import { useMutation, useQuery } from '@tanstack/react-query';

import {
	getCheckEmailDomainsQuery,
	getCourseQuery,
	getStudentByEmailQuery,
	getUniversitiesQuery,
	registerStudentQuery,
} from '../api/registration.api';
import type { IRegistrationFormType } from '../model/registration.dto';
import { registrationQueryKeys } from '../model/registration.query-keys';

export function useEmailCheck(email: string, enabled = false) {
	return useQuery({
		queryKey: registrationQueryKeys.emailCheck(email),
		queryFn: () => getStudentByEmailQuery(email),
		retry: false,
		enabled: !!email && enabled,
	});
}

export function useUniversityQuery(enabled = true) {
	return useQuery({
		queryKey: registrationQueryKeys.universities(),
		queryFn: getUniversitiesQuery,
		enabled,
	});
}

export function useCourseQuery(enabled = true) {
	return useQuery({
		queryKey: registrationQueryKeys.courses(),
		queryFn: getCourseQuery,
		enabled,
	});
}

export function useCheckEmailDomains() {
	return useMutation({
		mutationFn: async ({ email, universityId }: { email?: string; universityId?: number }) => {
			if (!email || !universityId) return false;
			return getCheckEmailDomainsQuery(email, universityId);
		},
	});
}

export function useRegistrationMutation() {
	return useMutation({
		mutationFn: async (data: IRegistrationFormType) => registerStudentQuery(data),
	});
}
