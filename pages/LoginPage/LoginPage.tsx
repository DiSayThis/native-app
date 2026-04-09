import { useMemo } from 'react';

import { Image, StyleSheet, View } from 'react-native';

import { LoginForm } from '@/features/auth/ui/LoginForm';

import logoImage from '@/shared/assets/image/logo.png';
import { type AppTheme } from '@/shared/styles/tokens';
import KeyboardAwareScrollView from '@/shared/ui/KeyboardAwareScrollView';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

type LoginPageProps = {
	openResetPassword?: boolean;
};

export default function LoginPage({ openResetPassword = false }: LoginPageProps) {
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);

	return (
		<KeyboardAwareScrollView contentContainerStyle={styles.contentContainer}>
			<View style={styles.container}>
				<Image source={logoImage} style={styles.logo} resizeMode="contain" />
			</View>
			<LoginForm openResetPassword={openResetPassword} />
		</KeyboardAwareScrollView>
	);
}

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
		contentContainer: {
			flex: 1,
			justifyContent: 'center',
			flexGrow: 1,
			padding: 16,
			backgroundColor: theme.colors.background,
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
