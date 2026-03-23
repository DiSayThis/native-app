import { StyleSheet, Text } from 'react-native';

import { lightTheme } from '@/shared/styles/tokens';
import GradientBackHeaderLayout from '@/shared/ui/GradientBackHeaderLayout';

export default function StudentEditProfilePage() {
	return (
		<GradientBackHeaderLayout title="Личная информация">
			<Text style={styles.subtitle}>Страница редактирования профиля</Text>
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
