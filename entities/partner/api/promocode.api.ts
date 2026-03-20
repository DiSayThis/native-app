import type { IPromocodeDTO } from '@/entities/partner/model/partner.dto';

import { promocodeApi } from '@/shared/api/api-services';

export async function getDiscountPromocodeQuery(
	discountId: string,
	studentId: string,
): Promise<IPromocodeDTO | null> {
	if (!discountId || !studentId) {
		return null;
	}

	try {
		const response = await promocodeApi.post<
			IPromocodeDTO,
			{ discountId: string; studentId: string }
		>('/Discounts/getPromocode', {
			discountId,
			studentId,
		});

		return response ?? null;
	} catch {
		return null;
	}
}
