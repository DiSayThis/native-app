import { authApi } from '@/shared/api/api-servises';

import type { IAuthResponse, ILoginPayload } from '../model/auth.dto';

export const authQueries = {
	login: (data: ILoginPayload) => authApi.post<IAuthResponse>('/login?useCookies=true', data),
	logout: () => authApi.post('/logout'),
};
