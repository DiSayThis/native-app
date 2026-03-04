import { promocodeApi } from '@/shared/api/api-servises';
import { FILE_API, PROMOCODE_API } from '@/shared/api/urls';

import type { ICategoryDTO, IPartnerCard, IPartnerDTO } from '../model/discounts.dto';

export async function getCategoriesQuery(): Promise<ICategoryDTO[]> {
	return promocodeApi
		.get<ICategoryDTO[]>('/Categories')
		.then((data) =>
			Array.isArray(data)
				? data.map((category) => {
						return {
							...category,
							IconUrl: resolveCategoryIconUrl(
								category.IconUrl ?? `${FILE_API}/Categories/${category.id}`,
							),
						};
					})
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

function resolveCategoryIconUrl(iconPath: string): string {
	if (iconPath.startsWith('http://') || iconPath.startsWith('https://')) {
		return iconPath;
	}

	const normalizedPath = iconPath.startsWith('/') ? iconPath : `/${iconPath}`;
	return `${PROMOCODE_API}${normalizedPath}`;
}
