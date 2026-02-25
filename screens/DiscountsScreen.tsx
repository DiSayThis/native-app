import { StyleSheet, Text, View } from 'react-native';

import { lightTheme } from '@/shared/styles/tokens';

export default function DiscountsScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Скидки</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: lightTheme.spacing.x2,
	},
	title: {
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: lightTheme.typography.fontSizeHeading,
		color: lightTheme.colors.textColor,
	},
});
