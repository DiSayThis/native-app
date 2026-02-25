import type { AxiosError } from 'axios';

type AxiosErrorPayload = {
	message?: string;
	error?: string;
	errors?: Array<string | { message?: string }>;
};

export const getAxiosErrorMessage = (error: AxiosError, fallback = 'Unknown error occurred') => {
	const data = error.response?.data as AxiosErrorPayload | undefined;

	if (typeof data?.message === 'string' && data.message.trim().length > 0) return data.message;
	if (typeof data?.error === 'string' && data.error.trim().length > 0) return data.error;

	if (Array.isArray(data?.errors) && data.errors.length > 0) {
		const firstError = data.errors[0];

		if (typeof firstError === 'string' && firstError.trim().length > 0) return firstError;
		if (
			typeof firstError === 'object' &&
			firstError !== null &&
			typeof firstError.message === 'string' &&
			firstError.message.trim().length > 0
		) {
			return firstError.message;
		}
	}

	return fallback;
};
