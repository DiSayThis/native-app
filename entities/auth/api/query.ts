import { authApi } from '@/shared/api/api-servises';

import type { IAuthResponse, ILoginPayload } from '../model/auth.dto';

export const authQueries = {
	login: (data: ILoginPayload) =>
		authApi.post<IAuthResponse, ILoginPayload>('/login?useCookies=true', data),
	forgotPassword: (email: string) =>
		authApi.post<void, { email: string }>('/forgotPassword', { email }),
	logout: () => authApi.post('/logout'),
};
