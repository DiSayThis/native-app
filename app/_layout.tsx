import { useEffect } from 'react';

import { StyleSheet, View } from 'react-native';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppFonts } from '@/shared/lib/use-app-fonts';
import { PushNotificationsProvider } from '@/shared/providers/PushNotificationsProvider';
import { QueryProvider } from '@/shared/providers/QueryProvider';
import { lightTheme } from '@/shared/styles/tokens';
import { ThemeProvider, useTheme } from '@/shared/ui/theme/ThemeProvider';

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
			<GestureHandlerRootView style={styles.gestureRoot}>
				<SafeAreaProvider>
					<ThemeProvider>
						<BottomSheetModalProvider>
							<RootNavigator />
						</BottomSheetModalProvider>
					</ThemeProvider>
				</SafeAreaProvider>
			</GestureHandlerRootView>
		</QueryProvider>
	);
}

const styles = StyleSheet.create({
	gestureRoot: {
		flex: 1,
	},
	fallback: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
});

function RootNavigator() {
	const insets = useSafeAreaInsets();
	const { theme, scheme } = useTheme();

	useEffect(() => {
		void SystemUI.setBackgroundColorAsync(theme.colors.background);
	}, [theme.colors.background]);

	return (
		<>
			<StatusBar
				style={scheme === 'dark' ? 'light' : 'dark'}
				backgroundColor={theme.colors.background}
			/>
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { paddingTop: insets.top, backgroundColor: theme.colors.background },
				}}
			/>
		</>
	);
}
