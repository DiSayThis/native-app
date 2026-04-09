import type { PropsWithChildren } from 'react';

import { isExpoGo } from '@/shared/lib/is-expo-go';

export default function KeyboardProvider({ children }: PropsWithChildren) {
	if (isExpoGo) {
		return children;
	}

	const { KeyboardProvider: NativeKeyboardProvider } =
		require('react-native-keyboard-controller') as typeof import('react-native-keyboard-controller');

	return <NativeKeyboardProvider>{children}</NativeKeyboardProvider>;
}
