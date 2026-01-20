import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppFonts } from '@/shared/lib/use-app-fonts';

export default function RootLayout() {
	const [fontsLoaded] = useAppFonts();
	const insets = useSafeAreaInsets();

	if (!fontsLoaded) {
		return null; // или SplashScreen
	}

	return (
		<SafeAreaProvider>
			<StatusBar style="dark" />
			<Slot screenOptions={{ contentStyle: { paddingTop: insets.top } }} />
		</SafeAreaProvider>
	);
}
