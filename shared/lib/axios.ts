import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const axiosCore = axios.create({
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10_000,
});

axiosCore.interceptors.request.use(async (config) => {
	const token = await AsyncStorage.getItem('accessToken');

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

export const createApi = (baseURL: string) => {
	return {
		get: <T>(url: string, params?: unknown) =>
			axiosCore.get<T>(`${baseURL}${url}`, { params }).then((r) => r.data),

		post: <T, D = unknown>(url: string, data?: D) =>
			axiosCore.post<T>(`${baseURL}${url}`, data).then((r) => r.data),
		put: <T, D = unknown>(url: string, data?: D) =>
			axiosCore.put<T>(`${baseURL}${url}`, data).then((r) => r.data),

		delete: <T>(url: string) => axiosCore.delete<T>(`${baseURL}${url}`).then((r) => r.data),
	};
};
