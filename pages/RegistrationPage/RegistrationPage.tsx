import { useMemo } from 'react';

import { StyleSheet, View } from 'react-native';

import RegistrationForm from '@/features/registration/ui/RegistrationForm';

import { type AppTheme } from '@/shared/styles/tokens';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

export default function RegistrationPage() {
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);

	return (
		<View style={styles.page}>
			<RegistrationForm />
		</View>
	);
}

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
		page: {
			flex: 1,
			backgroundColor: theme.colors.background,
		},
	});
