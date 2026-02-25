export interface ILoginPayload {
	email: string;
	password: string;
}

interface IAuthUser {
	id: string;
	role: string;
}

export interface IAuthResponse {
	id?: string;
	role?: string;
	user?: IAuthUser;
	accessToken?: string;
	token?: string;
}
