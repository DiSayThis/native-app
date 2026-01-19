import { StyleSheet, Text, View } from 'react-native';

import { lightTheme } from '@/shared/styles/tokens';
import Button from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

export default function App() {
	return (
		<View style={styles.container}>
			<Text>Open up App.tsx to start working on your app!</Text>
			<Input />
			<Button />
			<Button />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: lightTheme.spacing.x2,
	},
});
