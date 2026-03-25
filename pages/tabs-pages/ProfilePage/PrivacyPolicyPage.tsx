import { useMemo } from 'react';

import { StyleSheet, Text } from 'react-native';

import { type AppTheme } from '@/shared/styles/tokens';
import GradientBackHeaderLayout from '@/shared/ui/GradientBackHeaderLayout';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

export default function PrivacyPolicyPage() {
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);

	return (
		<GradientBackHeaderLayout
			title="Политика 
		конфиденциальности"
		>
			<Text style={styles.subtitle}>Страница политики конфиденциальности</Text>
		</GradientBackHeaderLayout>
	);
}

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
		subtitle: {
			fontFamily: theme.typography.fontFamily,
			fontSize: 16,
			color: theme.colors.labelColor,
		},
	});
