import axios from 'axios';

import type { IPartnerCard, IPartnerDTO } from '@/features/discounts/model/discounts.dto';

import { promocodeApi } from '@/shared/api/api-servises';
import { PROMOCODE_API } from '@/shared/api/urls';
import { axiosCore } from '@/shared/lib/axios';

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

export async function addToFavoritePartner(partnerId: string, studentId: string) {
	if (!studentId) {
		throw new Error('Student id is required');
	}

	try {
		return await promocodeApi.post<unknown, { partnerId: string; studentId: string }>(
			'/Favourites',
			{
				partnerId,
				studentId,
			},
		);
	} catch (error: unknown) {
		if (axios.isAxiosError(error) && error.response?.status === 500) {
			return { ignoredError: true, status: 500 };
		}
		throw error;
	}
}

export async function deleteFavoritePartner(partnerId: string, studentId: string) {
	if (!studentId) {
		throw new Error('Student id is required');
	}

	return axiosCore
		.delete(`${PROMOCODE_API}/Favourites`, {
			data: { partnerId, studentId },
		})
		.then((response) => response.data);
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
