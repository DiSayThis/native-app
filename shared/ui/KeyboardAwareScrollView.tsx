import { type ForwardedRef, forwardRef } from 'react';

import { Platform, type ScrollViewProps, StyleSheet } from 'react-native';

import {
	KeyboardAwareScrollView as FallbackKeyboardAwareScrollView,
	type KeyboardAwareScrollViewProps as FallbackKeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view';
import type * as KeyboardControllerModule from 'react-native-keyboard-controller';

import { isExpoGo } from '@/shared/lib/is-expo-go';

const DEFAULT_BOTTOM_OFFSET = 62;
const DEFAULT_EXTRA_KEYBOARD_SPACE = 32;
const FALLBACK_EXTRA_HEIGHT = 120;

type KeyboardAwareScrollViewProps = ScrollViewProps &
	Omit<
		FallbackKeyboardAwareScrollViewProps,
		keyof ScrollViewProps | 'innerRef' | 'enableOnAndroid' | 'extraHeight' | 'extraScrollHeight'
	> & {
		bottomOffset?: number;
		extraKeyboardSpace?: number;
	};

type NativeKeyboardAwareScrollViewRef = KeyboardControllerModule.KeyboardAwareScrollViewRef;
type FallbackKeyboardAwareScrollViewRef = InstanceType<typeof FallbackKeyboardAwareScrollView>;

export type KeyboardAwareScrollViewRef =
	| FallbackKeyboardAwareScrollViewRef
	| NativeKeyboardAwareScrollViewRef;

const setRef = (
	ref: ForwardedRef<KeyboardAwareScrollViewRef>,
	value: KeyboardAwareScrollViewRef | null,
) => {
	if (typeof ref === 'function') {
		ref(value);
		return;
	}

	if (ref) {
		ref.current = value;
	}
};

const KeyboardAwareScrollView = forwardRef<
	KeyboardAwareScrollViewRef,
	KeyboardAwareScrollViewProps
>(
	(
		{
			contentContainerStyle,
			keyboardDismissMode,
			keyboardShouldPersistTaps,
			bottomOffset = DEFAULT_BOTTOM_OFFSET,
			extraKeyboardSpace = DEFAULT_EXTRA_KEYBOARD_SPACE,
			...rest
		},
		ref,
	) => {
		if (isExpoGo) {
			return (
				<FallbackKeyboardAwareScrollView
					{...rest}
					innerRef={(instance) => {
						setRef(ref, instance as unknown as KeyboardAwareScrollViewRef);
					}}
					enableOnAndroid
					enableAutomaticScroll
					extraHeight={FALLBACK_EXTRA_HEIGHT}
					extraScrollHeight={extraKeyboardSpace}
					style={[styles.scroll, rest.style]}
					contentContainerStyle={[styles.content, contentContainerStyle]}
					keyboardShouldPersistTaps={keyboardShouldPersistTaps ?? 'handled'}
					keyboardDismissMode={
						keyboardDismissMode ?? (Platform.OS === 'ios' ? 'interactive' : 'on-drag')
					}
				/>
			);
		}

		// `react-native-keyboard-controller` must stay lazily loaded outside Expo Go.
		const { KeyboardAwareScrollView: NativeKeyboardAwareScrollView } =
			require('react-native-keyboard-controller') as typeof KeyboardControllerModule; // eslint-disable-line @typescript-eslint/no-require-imports

		return (
			<NativeKeyboardAwareScrollView
				{...rest}
				ref={(instance) => {
					setRef(ref, instance);
				}}
				bottomOffset={bottomOffset}
				extraKeyboardSpace={extraKeyboardSpace}
				style={[styles.scroll, rest.style]}
				contentContainerStyle={[styles.content, contentContainerStyle]}
				keyboardShouldPersistTaps={keyboardShouldPersistTaps ?? 'handled'}
				keyboardDismissMode={
					keyboardDismissMode ?? (Platform.OS === 'ios' ? 'interactive' : 'on-drag')
				}
			/>
		);
	},
);

KeyboardAwareScrollView.displayName = 'KeyboardAwareScrollView';

export default KeyboardAwareScrollView;

const styles = StyleSheet.create({
	scroll: {
		flex: 1,
	},
	content: {
		paddingBottom: DEFAULT_EXTRA_KEYBOARD_SPACE,
	},
});
