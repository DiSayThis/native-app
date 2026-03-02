export interface ICategoryDTO {
	id: number;
	name: string;
	IconUrl?: string;
}

export interface IPartnerDTO {
	id: string;
	companyName: string;
	subtitle: string;
	maxDiscount?: string;
	category?: { id?: number | null } | null;
	isFixed?: boolean;
}

export interface IPartnerCard {
	id: string;
	heading: string;
	subtitle: string;
	discount?: string;
	categoryId: number;
	isFixed: boolean;
}
