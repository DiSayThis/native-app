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
	description?: string;
	site?: string;
	hasAllRegions?: boolean;
	regions?: unknown[];
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

export interface IDiscountDTO {
	id: string;
	name: string;
	description: string;
	size?: number;
	promocodeValue?: string;
	hasAllRegions?: boolean;
	regions?: unknown[];
}
