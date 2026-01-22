export interface ILoginPayload {
	email: string;
	password: string;
}

export interface IAuthResponse {
	id: string;
	role: string;
}
