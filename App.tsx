import { StyleSheet, Text, View } from 'react-native';

import { StatusBar } from 'expo-status-bar';

import { Input } from '@/shared/ui/Input';

import Up from './assets/icons/up.svg';

export default function App() {
	return (
		<View style={styles.container}>
			<Text style={{ color: 'red' }}>Open up App.tsx to start working on your app!</Text>
			<Text style={{ backgroundColor: 'red' }}>Open up App.tsx to start working on your app!</Text>
			<Input />
			<StatusBar style="auto" />
			<Up width={100} height={100} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
