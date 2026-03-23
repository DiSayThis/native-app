import { promocodeApi } from '@/shared/api/api-services';

import type { IRegionDTO } from '../model/city-region.dto';

export async function getRegionsQuery(): Promise<IRegionDTO[]> {
	return promocodeApi
		.get<IRegionDTO[]>('/Regions')
		.then((data) => (Array.isArray(data) ? data : []))
		.catch(() => []);
}
