import { promocodeApi } from '@/shared/api/api-servises';

import type { ICategoryDTO, IPartnerCard, IPartnerDTO } from '../model/discounts.dto';

export async function getCategoriesQuery(): Promise<ICategoryDTO[]> {
	return promocodeApi
		.get<ICategoryDTO[]>('/Categories')
		.then((data) =>
			Array.isArray(data)
				? data.map((category) => ({
						...category,
						IconUrl: category.IconUrl ?? `/api/files/Categories/${category.id}`,
					}))
				: [],
		)
		.catch(() => []);
}

export async function getPartnersQuery(): Promise<IPartnerCard[]> {
	return promocodeApi
		.get<IPartnerDTO[]>('/Partners')
		.then((data) => (Array.isArray(data) ? data : []).map(mapPartnerToCard))
		.catch(() => []);
}

function mapPartnerToCard(item: IPartnerDTO): IPartnerCard {
	return {
		id: item.id,
		heading: item.companyName,
		subtitle: item.subtitle,
		discount: item.maxDiscount,
		categoryId: item.category?.id ?? 0,
		isFixed: Boolean(item.isFixed),
	};
}
