import { StyleSheet, Text, View } from 'react-native';

import { Link } from 'expo-router';

import { lightTheme } from '@/shared/styles/tokens';
import Button from '@/shared/ui/Button';

export default function MainScreen() {
	return (
		<View style={styles.container}>
			<Text>User</Text>
			<Button />
			<Link href="/partner-offer/123">Go to offer</Link>
			<Link href="/login">Go to login</Link>
			<Link href="/registration">Go to registration</Link>
			<Link href="/profile">Go to profile</Link>
			<Link href="/unmatched">Go to unmatched</Link>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: lightTheme.spacing.x2,
	},
});
