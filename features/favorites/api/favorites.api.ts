import type { IPartnerCard, IPartnerDTO } from '@/features/discounts/model/discounts.dto';

import { promocodeApi } from '@/shared/api/api-servises';

export async function getFavoritePartnersQuery(studentId: string): Promise<IPartnerCard[]> {
	if (!studentId) return [];

	try {
		const data = await promocodeApi.get<IPartnerDTO[]>(`/Favourites/${studentId}`);
		return normalizeCards(data);
	} catch {
		try {
			const data = await promocodeApi.get<IPartnerDTO[]>('/Favourites', { studentId });
			return normalizeCards(data);
		} catch {
			return [];
		}
	}
}

function normalizeCards(data: IPartnerDTO[] | unknown): IPartnerCard[] {
	return (Array.isArray(data) ? data : []).map((item) => ({
		id: item.id,
		heading: item.companyName,
		subtitle: item.subtitle,
		discount: item.maxDiscount,
		categoryId: item.category?.id ?? 0,
		isFixed: Boolean(item.isFixed),
	}));
}
