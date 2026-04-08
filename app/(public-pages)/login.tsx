import { Redirect, useLocalSearchParams } from 'expo-router';
import { useAtomValue } from 'jotai';

import LoginPageView from '@/pages/LoginPage';

import { authAtom } from '@/entities/auth/model/auth.store';

export default function LoginPage() {
	const { id } = useAtomValue(authAtom);
	const { resetPassword } = useLocalSearchParams<{
		resetPassword?: string | string[];
	}>();
	const shouldOpenResetPassword =
		(Array.isArray(resetPassword) ? resetPassword[0] : resetPassword) === 'true';

	if (id) {
		return <Redirect href="/discounts" />;
	}

	return <LoginPageView openResetPassword={shouldOpenResetPassword} />;
}
