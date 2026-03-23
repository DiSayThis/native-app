import { StyleSheet, Text } from 'react-native';

import { lightTheme } from '@/shared/styles/tokens';
import GradientBackHeaderLayout from '@/shared/ui/GradientBackHeaderLayout';

export default function CookiesPolicyPage() {
	return (
		<GradientBackHeaderLayout title="Политика использования файлов cookies">
			<Text style={styles.subtitle}>Страница политики использования файлов cookies</Text>
		</GradientBackHeaderLayout>
	);
}

const styles = StyleSheet.create({
	subtitle: {
		fontFamily: lightTheme.typography.fontFamily,
		fontSize: 16,
		color: lightTheme.colors.labelColor,
	},
});
