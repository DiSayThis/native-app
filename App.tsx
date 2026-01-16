import { StyleSheet, Text, View } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { Camera } from 'lucide-react-native';

import Up from '@/shared/assets/icons/up.svg';
import { Input } from '@/shared/ui/Input';

export default function App() {
	return (
		<View style={styles.container}>
			<Text style={{ color: 'red' }}>Open up App.tsx to start working on your app!</Text>
			<Text style={{ backgroundColor: 'red' }}>Open up App.tsx to start working on your app!</Text>
			<Input />
			<StatusBar style="auto" />
			<Up width={100} height={100} />
			<Camera color="red" size={48} />
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
