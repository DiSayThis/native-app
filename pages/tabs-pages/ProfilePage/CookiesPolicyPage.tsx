import { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';

import { type AppTheme } from '@/shared/styles/tokens';
import GradientBackHeaderLayout from '@/shared/ui/GradientBackHeaderLayout';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

export default function CookiesPolicyPage() {
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);

	return (
		<GradientBackHeaderLayout title="Политика использования файлов cookies">
			<Text style={styles.subtitle}>Страница политики использования файлов cookies</Text>
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
