import { Redirect, useLocalSearchParams } from 'expo-router';
import { useAtomValue } from 'jotai';

import RegistrationPageView from '@/pages/RegistrationPage';

import { authAtom } from '@/entities/auth/model/auth.store';

export default function RegistrationPage() {
	const { id } = useAtomValue(authAtom);
	const params = useLocalSearchParams<{
		promocode?: string | string[];
		promoCode?: string | string[];
		Promocode?: string | string[];
		PromoCode?: string | string[];
	}>();
	const rawPromocode = params.promocode ?? params.promoCode ?? params.Promocode ?? params.PromoCode;
	const promocode = Array.isArray(rawPromocode) ? (rawPromocode[0] ?? '') : (rawPromocode ?? '');

	if (id) {
		return <Redirect href="/" />;
	}

	return <RegistrationPageView promocode={promocode} />;
}
