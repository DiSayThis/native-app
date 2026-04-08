import { useMemo } from 'react';

import { ScrollView, StyleSheet, View } from 'react-native';

import { ResetPasswordForm } from '@/features/auth/ui/ResetPasswordForm';

import { type AppTheme } from '@/shared/styles/tokens';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

type ResetPasswordPageProps = {
	email: string;
	resetCode: string;
};

export default function ResetPasswordPage({ email, resetCode }: ResetPasswordPageProps) {
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);

	return (
		<ScrollView contentContainerStyle={styles.contentContainer}>
			<View style={styles.container}>
				<ResetPasswordForm email={email} resetCode={resetCode} />
			</View>
		</ScrollView>
	);
}

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
		contentContainer: {
			flexGrow: 1,
			padding: 16,
			backgroundColor: theme.colors.background,
		},
		container: {
			flex: 1,
			justifyContent: 'center',
		},
	});
