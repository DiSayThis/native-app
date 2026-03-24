import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { LoginForm } from '@/features/auth/ui/LoginForm';

import { type AppTheme } from '@/shared/styles/tokens';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

export default function LoginPage() {
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);

	return (
		<ScrollView contentContainerStyle={styles.contentContainer}>
			<View style={styles.container}>
				<LoginForm />
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
