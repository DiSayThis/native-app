import { Redirect } from 'expo-router';
import { useAtomValue } from 'jotai';

import LoginScreen from '@/screens/public-pages/LoginScreen';

import { authAtom } from '@/entities/auth/model/auth.store';

export default function LoginPage() {
	const { id } = useAtomValue(authAtom);
	if (id) {
		return <Redirect href="/discounts" />;
	}

	return <LoginScreen />;
}
