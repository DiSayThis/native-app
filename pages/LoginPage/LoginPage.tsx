import { useMemo } from 'react';

import { Image, StyleSheet, View } from 'react-native';

import { LoginForm } from '@/features/auth/ui/LoginForm';

import logoImage from '@/shared/assets/image/logo.png';
import logoLightImage from '@/shared/assets/image/studmart_logo_light.png';
import KeyboardAwareScrollView from '@/shared/ui/KeyboardAwareScrollView';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

type LoginPageProps = {
	openResetPassword?: boolean;
};

export default function LoginPage({ openResetPassword = false }: LoginPageProps) {
	const { scheme } = useTheme();
	const styles = useMemo(() => createStyles(), []);
	const logoSource = scheme === 'dark' ? logoLightImage : logoImage;

	return (
		<KeyboardAwareScrollView contentContainerStyle={styles.contentContainer}>
			<View style={styles.container}>
				<Image source={logoSource} style={styles.logo} resizeMode="contain" />
			</View>
			<LoginForm openResetPassword={openResetPassword} />
		</KeyboardAwareScrollView>
	);
}

const createStyles = () =>
	StyleSheet.create({
		contentContainer: {
			justifyContent: 'center',
			flexGrow: 1,
			paddingHorizontal: 16,
		},
		container: {
			justifyContent: 'center',
			alignItems: 'center',
			gap: 24,
		},
		logo: {
			width: 160,
			height: 160,
		},
	});
