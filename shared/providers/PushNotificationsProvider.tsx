import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

import * as Notifications from 'expo-notifications';

import {
	configureNotificationChannel,
	registerForPushNotificationsAsync,
} from '@/shared/lib/notifications/register-for-push-notifications';

type PushNotificationsContextValue = {
	expoPushToken: string | null;
	lastNotification: Notifications.Notification | null;
	notificationResponse: Notifications.NotificationResponse | null;
	permissionStatus: Notifications.PermissionStatus | null;
	registrationError: string | null;
	refreshPushToken: () => Promise<void>;
};

const PushNotificationsContext = createContext<PushNotificationsContextValue | null>(null);

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldPlaySound: true,
		shouldSetBadge: false,
		shouldShowBanner: true,
		shouldShowList: true,
	}),
});

export function PushNotificationsProvider({ children }: { children: React.ReactNode }) {
	const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
	const [lastNotification, setLastNotification] = useState<Notifications.Notification | null>(null);
	const [notificationResponse, setNotificationResponse] =
		useState<Notifications.NotificationResponse | null>(null);
	const [permissionStatus, setPermissionStatus] = useState<Notifications.PermissionStatus | null>(
		null,
	);
	const [registrationError, setRegistrationError] = useState<string | null>(null);
	const notificationListener = useRef<Notifications.EventSubscription | null>(null);
	const responseListener = useRef<Notifications.EventSubscription | null>(null);

	const refreshPushToken = async () => {
		const result = await registerForPushNotificationsAsync();

		setExpoPushToken(result.token);
		setPermissionStatus(result.permissionStatus);
		setRegistrationError(result.error);
	};

	useEffect(() => {
		void configureNotificationChannel();
		void refreshPushToken();

		notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
			setLastNotification(notification);
		});
		responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
			setNotificationResponse(response);
		});

		return () => {
			notificationListener.current?.remove();
			responseListener.current?.remove();
		};
	}, []);

	useEffect(() => {
		if (!__DEV__ || !expoPushToken) {
			return;
		}

		console.log('Expo push token:', expoPushToken);
	}, [expoPushToken]);

	const value = useMemo<PushNotificationsContextValue>(
		() => ({
			expoPushToken,
			lastNotification,
			notificationResponse,
			permissionStatus,
			registrationError,
			refreshPushToken,
		}),
		[expoPushToken, lastNotification, notificationResponse, permissionStatus, registrationError],
	);

	return (
		<PushNotificationsContext.Provider value={value}>{children}</PushNotificationsContext.Provider>
	);
}

export function usePushNotifications() {
	const context = useContext(PushNotificationsContext);

	if (!context) {
		throw new Error('usePushNotifications must be used within PushNotificationsProvider');
	}

	return context;
}
