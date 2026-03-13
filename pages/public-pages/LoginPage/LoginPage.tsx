import { ScrollView, StyleSheet, View } from 'react-native';

import { LoginForm } from '@/features/auth/ui/LoginForm';

import { lightTheme } from '@/shared/styles/tokens';

export default function LoginPage() {
	return (
		<ScrollView contentContainerStyle={styles.contentContainer}>
			<View style={styles.container}>
				<LoginForm />
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	contentContainer: {
		flexGrow: 1,
		padding: 16,
		backgroundColor: lightTheme.colors.background,
	},
	container: {
		flex: 1,
		justifyContent: 'center',
	},
});
