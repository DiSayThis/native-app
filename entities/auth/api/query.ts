import { authApi } from '@/shared/api/api-services';

import type { IAuthResponse, ILoginPayload } from '../model/auth.dto';

export const authQueries = {
	login: (data: ILoginPayload) =>
		authApi.post<IAuthResponse, ILoginPayload>('/login?useCookies=true', data),
	forgotPassword: (email: string) =>
		authApi.post<void, { email: string }>('/forgotPassword', { email }),
	resetPassword: (payload: { email: string; resetCode: string; newPassword: string }) =>
		authApi.post<void, { email: string; resetCode: string; newPassword: string }>(
			'/resetPassword',
			payload,
		),
	logout: () => authApi.post('/logout'),
};
