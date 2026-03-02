import { StyleSheet, Text, View } from 'react-native';

import { lightTheme } from '@/shared/styles/tokens';

export default function MainScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Кошелек</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: lightTheme.spacing.x2,

		backgroundColor: lightTheme.colors.background,
	},
	title: {
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: lightTheme.typography.fontSizeHeading,
		color: lightTheme.colors.textColor,
	},
});
