import { StyleSheet, Text, View } from 'react-native';

import { router } from 'expo-router';

import { lightTheme } from '@/shared/styles/tokens';
import Button from '@/shared/ui/Button';

export default function UnmatchedPage() {
	return (
		<View style={styles.container}>
			<Text style={styles.header}>Ой что-то пошло не так</Text>
			<Text style={styles.text}>Попробуйте вернуться на главный экран приложения</Text>
			<Button style={styles.link} onPress={() => router.back()}>
				Вернуться на главный экран
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: lightTheme.spacing.x5,
		backgroundColor: lightTheme.colors.background,
	},
	header: { fontSize: lightTheme.typography.fontSizeHeading },
	text: { fontSize: lightTheme.typography.fontSizeBase, textAlign: 'center' },
	link: { marginTop: lightTheme.spacing.x5, width: '100%' },
});
