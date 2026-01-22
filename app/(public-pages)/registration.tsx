import { Redirect } from 'expo-router';
import { useAtomValue } from 'jotai';

import { authAtom } from '@/entities/auth/model/auth.store';

export default function RegistrationPage() {
	const { id } = useAtomValue(authAtom);
	if (id) {
		return <Redirect href={'/'} />;
	}
	return <></>;
}
