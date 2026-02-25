import { Redirect, Tabs } from 'expo-router';
import { useAtomValue } from 'jotai';
import { Heart, Percent, UserRound, Wallet } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { authAtom } from '@/entities/auth/model/auth.store';

import { lightTheme } from '@/shared/styles/tokens';

const TAB_SIDE_OFFSET = 16;
const TAB_BOTTOM_OFFSET = 12;
const TAB_RADIUS = 20;
const TAB_HEIGHT = 68;

export default function TabsLayout() {
	const insets = useSafeAreaInsets();
	const { id } = useAtomValue(authAtom);

	if (!id) {
		return <Redirect href="/login" />;
	}

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: lightTheme.colors.textColor,
				tabBarInactiveTintColor: lightTheme.colors.gray,
				tabBarHideOnKeyboard: true,
				tabBarStyle: {
					position: 'absolute',
					bottom: insets.bottom + TAB_BOTTOM_OFFSET,
					height: TAB_HEIGHT,
					borderTopWidth: 0,
					borderRadius: TAB_RADIUS,
					paddingBottom: lightTheme.spacing.x2,
					marginHorizontal: TAB_SIDE_OFFSET,
					paddingTop: 6,
					backgroundColor: lightTheme.colors.bgWhite,
					elevation: 8,
					shadowColor: '#000',
					shadowOpacity: 0.08,
					shadowOffset: { width: 0, height: 4 },
					shadowRadius: 8,
				},
				tabBarLabelStyle: {
					fontFamily: lightTheme.typography.fontFamily,
					fontSize: 12,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Кошелек',
					tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} />,
				}}
			/>
			<Tabs.Screen
				name="favorites"
				options={{
					title: 'Избранное',
					tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
				}}
			/>
			<Tabs.Screen
				name="discounts"
				options={{
					title: 'Скидки',
					tabBarIcon: ({ color, size }) => <Percent color={color} size={size} />,
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: 'Профиль',
					tabBarIcon: ({ color, size }) => <UserRound color={color} size={size} />,
				}}
			/>
		</Tabs>
	);
}
