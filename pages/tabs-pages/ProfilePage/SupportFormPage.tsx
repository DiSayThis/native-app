import { StyleSheet, Text } from 'react-native';

import { lightTheme } from '@/shared/styles/tokens';
import GradientBackHeaderLayout from '@/shared/ui/GradientBackHeaderLayout';

export default function SupportFormPage() {
	return (
		<GradientBackHeaderLayout title="Техническая поддержка">
			<Text style={styles.subtitle}>Страница формы обращения в поддержку</Text>
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
