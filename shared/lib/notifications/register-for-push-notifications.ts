import { Platform } from 'react-native';

import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

const DEFAULT_ANDROID_CHANNEL_ID = 'default';
const DEFAULT_ANDROID_CHANNEL_NAME = 'Default';
const DEFAULT_NOTIFICATION_COLOR = '#8FE248';

type PushRegistrationResult = {
	token: string | null;
	error: string | null;
	permissionStatus: Notifications.PermissionStatus | null;
};

function getProjectId() {
	return Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId ?? null;
}

export async function configureNotificationChannel() {
	if (Platform.OS !== 'android') {
		return;
	}

	await Notifications.setNotificationChannelAsync(DEFAULT_ANDROID_CHANNEL_ID, {
		name: DEFAULT_ANDROID_CHANNEL_NAME,
		importance: Notifications.AndroidImportance.MAX,
		vibrationPattern: [0, 250, 250, 250],
		lightColor: DEFAULT_NOTIFICATION_COLOR,
	});
}

export async function registerForPushNotificationsAsync(): Promise<PushRegistrationResult> {
	if (Platform.OS === 'web') {
		return {
			token: null,
			error: 'Push notifications are not supported on web.',
			permissionStatus: null,
		};
	}

	await configureNotificationChannel();

	if (!Device.isDevice) {
		return {
			token: null,
			error: 'Push notifications require a physical device.',
			permissionStatus: null,
		};
	}

	const permissions = await Notifications.getPermissionsAsync();
	let permissionStatus = permissions.status;

	if (permissionStatus !== 'granted') {
		const requestedPermissions = await Notifications.requestPermissionsAsync();
		permissionStatus = requestedPermissions.status;
	}

	if (permissionStatus !== 'granted') {
		return {
			token: null,
			error: 'Push notification permission was not granted.',
			permissionStatus,
		};
	}

	const projectId = getProjectId();

	if (!projectId) {
		return {
			token: null,
			error: 'EAS projectId is missing. Add it before requesting Expo push tokens.',
			permissionStatus,
		};
	}

	try {
		const pushToken = await Notifications.getExpoPushTokenAsync({ projectId });

		return {
			token: pushToken.data,
			error: null,
			permissionStatus,
		};
	} catch {
		return {
			token: null,
			error: 'Failed to get Expo push token.',
			permissionStatus,
		};
	}
}
