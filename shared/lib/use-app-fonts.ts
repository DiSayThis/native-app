import { useFonts } from 'expo-font';

import { fonts } from '@/shared/assets/fonts/fonts';

export function useAppFonts() {
	return useFonts({
		// Mulish
		'Mulish-Light': fonts.Mulish.light,
		Mulish: fonts.Mulish.regular,
		'Mulish-Medium': fonts.Mulish.medium,
		'Mulish-SemiBold': fonts.Mulish.semiBold,
		'Mulish-Bold': fonts.Mulish.bold,

		// Nunito Sans
		'NunitoSans-Light': fonts.NunitoSans.light,
		NunitoSans: fonts.NunitoSans.regular,
		'NunitoSans-Medium': fonts.NunitoSans.medium,
		'NunitoSans-SemiBold': fonts.NunitoSans.semiBold,
		'NunitoSans-Bold': fonts.NunitoSans.bold,
	});
}
