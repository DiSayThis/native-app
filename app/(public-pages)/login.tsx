import { Redirect } from 'expo-router';
import { useAtomValue } from 'jotai';

import LoginPageView from '@/pages/public-pages/LoginPage';

import { authAtom } from '@/entities/auth/model/auth.store';

export default function LoginPage() {
	const { id } = useAtomValue(authAtom);
	if (id) {
		return <Redirect href="/discounts" />;
	}

	return <LoginPageView />;
}
