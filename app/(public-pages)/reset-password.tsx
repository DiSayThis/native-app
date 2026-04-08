import { Redirect, useLocalSearchParams } from 'expo-router';
import { useAtomValue } from 'jotai';

import ResetPasswordPageView from '@/pages/ResetPasswordPage';

import { authAtom } from '@/entities/auth/model/auth.store';

export default function ResetPasswordPage() {
	const { id } = useAtomValue(authAtom);
	const { Email, ResetCode } = useLocalSearchParams<{
		Email?: string | string[];
		ResetCode?: string | string[];
	}>();
	const email = Array.isArray(Email) ? (Email[0] ?? '') : (Email ?? '');
	const resetCode = Array.isArray(ResetCode) ? (ResetCode[0] ?? '') : (ResetCode ?? '');

	if (id) {
		return <Redirect href="/discounts" />;
	}

	return <ResetPasswordPageView email={email} resetCode={resetCode} />;
}
