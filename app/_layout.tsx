import { useEffect } from 'react';

import { StyleSheet, View } from 'react-native';

import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppFonts } from '@/shared/lib/use-app-fonts';
import { QueryProvider } from '@/shared/providers/QueryProvider';
import { lightTheme } from '@/shared/styles/tokens';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [fontsLoaded] = useAppFonts();

	useEffect(() => {
		if (fontsLoaded) SplashScreen.hideAsync();
	}, [fontsLoaded]);

	if (!fontsLoaded) {
		return <View style={styles.fallback} />;
	}

	return (
		<QueryProvider>
			<SafeAreaProvider>
				<RootNavigator />
			</SafeAreaProvider>
		</QueryProvider>
	);
}

const styles = StyleSheet.create({
	fallback: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
});

function RootNavigator() {
	const insets = useSafeAreaInsets();

	return (
		<>
			<StatusBar style="auto" backgroundColor={lightTheme.colors.background} />
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { paddingTop: insets.top, backgroundColor: lightTheme.colors.background },
				}}
			/>
		</>
	);
}
