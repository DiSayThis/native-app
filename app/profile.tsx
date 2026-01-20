import { StyleSheet, Text, View } from 'react-native';

import { lightTheme } from '@/shared/styles/tokens';

export default function ProfilePage() {
	return (
		<View style={styles.container}>
			<Text style={{ fontFamily: lightTheme.typography.fontFamilyHeadings }}>
				Open up App.tsx to start working on your app!
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: lightTheme.spacing.x2,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
