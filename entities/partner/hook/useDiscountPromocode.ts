import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getDiscountPromocodeQuery } from '../api/promocode.api';

export function useDiscountPromocode(
	discountId?: string,
	studentId?: string | null,
	enabled = false,
) {
	const normalizedDiscountId = discountId ?? '';
	const normalizedStudentId = studentId ?? '';
	const isEnabled = Boolean(normalizedDiscountId && normalizedStudentId && enabled);

	const query = useQuery({
		queryKey: ['partner-entity', 'discount-promocode', normalizedDiscountId, studentId ?? null],
		queryFn: () => getDiscountPromocodeQuery(normalizedDiscountId, normalizedStudentId),
		enabled: isEnabled,
		staleTime: 60_000,
	});

	const promocode = useMemo(() => {
		const value = query.data?.promocode ?? query.data?.promocodeValue ?? '';
		return value.trim();
	}, [query.data?.promocode, query.data?.promocodeValue]);

	return {
		...query,
		promocode,
	};
}
