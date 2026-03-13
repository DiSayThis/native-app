import type { IDiscountDTO, IPartnerDTO } from '@/entities/partner/model/partner.dto';

import { promocodeApi } from '@/shared/api/api-services';

export async function getPartnerOfferQuery(
	partnerId: string,
	studentId?: string | null,
): Promise<IPartnerDTO> {
	const params: Record<string, string> = { Id: partnerId };
	if (studentId) {
		params.StudentId = studentId;
	}

	return promocodeApi.get<IPartnerDTO>('/Partners', params);
}

export async function getPartnerDiscountsQuery(partnerId: string): Promise<IDiscountDTO[]> {
	const data = await promocodeApi.get<IDiscountDTO[]>('/Discounts/getPartnerAllDiscount', {
		PartnerId: partnerId,
	});

	return Array.isArray(data) ? data : [];
}
