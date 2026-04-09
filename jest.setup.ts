import { jest } from '@jest/globals';
import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () =>
	require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

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
