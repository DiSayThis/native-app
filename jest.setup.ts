import { jest } from '@jest/globals';
import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () =>
	require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-safe-area-context', () => {
	const React = require('react');

	return {
		__esModule: true,
		SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
		SafeAreaConsumer: ({ children }: { children: (value: unknown) => React.ReactNode }) =>
			children({
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
			}),
		SafeAreaInsetsContext: {
			Provider: ({ children }: { children: React.ReactNode }) => children,
			Consumer: ({ children }: { children: (value: unknown) => React.ReactNode }) =>
				children({
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
				}),
		},
		useSafeAreaInsets: () => ({
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
		}),
		useSafeAreaFrame: () => ({
			x: 0,
			y: 0,
			width: 390,
			height: 844,
		}),
		initialWindowMetrics: {
			frame: {
				x: 0,
				y: 0,
				width: 390,
				height: 844,
			},
			insets: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
			},
		},
	};
});

jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => {
	const createTurboModule = () => ({
		getConstants: () => ({
			Dimensions: {
				window: {
					width: 390,
					height: 844,
					scale: 3,
					fontScale: 1,
				},
				screen: {
					width: 390,
					height: 844,
					scale: 3,
					fontScale: 1,
				},
			},
			isTesting: true,
			reactNativeVersion: {
				major: 0,
				minor: 83,
				patch: 6,
			},
		}),
		addListener: jest.fn(),
		removeListeners: jest.fn(),
	});

	return {
		get: jest.fn(() => createTurboModule()),
		getEnforcing: jest.fn(() => createTurboModule()),
	};
});

jest.mock('react-native/src/private/devsupport/devmenu/DevMenu', () => ({}));
jest.mock('react-native/src/private/devsupport/devmenu/specs/NativeDevMenu', () => ({}));

jest.mock('react-native-reanimated', () => {
	const ReactNative = require('react-native');

	return {
		__esModule: true,
		default: {
			View: ReactNative.View,
			createAnimatedComponent: (Component: unknown) => Component,
		},
		Easing: {
			out: (value: unknown) => value,
			in: (value: unknown) => value,
			cubic: 'cubic',
		},
		FadeInUp: {
			duration: () => ({
				delay: () => ({
					easing: () => ({}),
				}),
			}),
		},
		FadeOutDown: {
			duration: () => ({
				easing: () => ({}),
			}),
		},
		interpolateColor: () => '#000',
		useAnimatedStyle: () => ({}),
		useSharedValue: (value: unknown) => ({ value }),
		withSpring: (value: unknown) => value,
		withTiming: (value: unknown) => value,
	};
});

jest.mock('react-native-keyboard-aware-scroll-view', () => {
	const React = require('react');
	const ReactNative = require('react-native');

	const MockKeyboardAwareScrollView = React.forwardRef((props: any, ref: any) =>
		React.createElement(ReactNative.ScrollView, { ...props, ref }),
	);

	return {
		__esModule: true,
		KeyboardAwareScrollView: MockKeyboardAwareScrollView,
	};
});

jest.mock('react-native-keyboard-controller', () => {
	const React = require('react');
	const ReactNative = require('react-native');

	const MockKeyboardAwareScrollView = React.forwardRef((props: any, ref: any) =>
		React.createElement(ReactNative.ScrollView, { ...props, ref }),
	);

	return {
		__esModule: true,
		KeyboardProvider: ({ children }: { children: any }) => children,
		KeyboardAwareScrollView: MockKeyboardAwareScrollView,
	};
});
