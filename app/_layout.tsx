import { useEffect } from 'react';

import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppFonts } from '@/shared/lib/use-app-fonts';
import { lightTheme } from '@/shared/styles/tokens';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [fontsLoaded] = useAppFonts();
	const insets = useSafeAreaInsets();

	useEffect(() => {
		if (fontsLoaded) SplashScreen.hideAsync();
	}, [fontsLoaded]);

	if (!fontsLoaded) {
		return null; // или SplashScreen
	}

	return (
		<SafeAreaProvider>
			<StatusBar style="dark" backgroundColor={lightTheme.colors.background} />
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { paddingTop: insets.top, backgroundColor: lightTheme.colors.background },
				}}
			/>
		</SafeAreaProvider>
	);
}
