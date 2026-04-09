import { useEffect, useMemo, useRef, useState } from 'react';

import {
	DeviceEventEmitter,
	Dimensions,
	findNodeHandle,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	type ScrollViewProps,
	StyleSheet,
	TextInput,
	UIManager,
	type ViewStyle,
} from 'react-native';

const KEYBOARD_EXTRA_OFFSET = 40;
const BASE_CONTENT_BOTTOM_PADDING = 24;

type KeyboardAwareScrollViewProps = ScrollViewProps;

export default function KeyboardAwareScrollView({
	children,
	contentContainerStyle,
	keyboardDismissMode,
	keyboardShouldPersistTaps,
	...rest
}: KeyboardAwareScrollViewProps) {
	const scrollRef = useRef<ScrollView>(null);
	const scrollYRef = useRef(0);
	const keyboardHeightRef = useRef(0);
	const pendingFocusedInputRef = useRef<number | null>(null);
	const [keyboardHeight, setKeyboardHeight] = useState(0);

	useEffect(() => {
		const scrollToFocusedInput = (target: number | null | undefined) => {
			if (!target || !scrollRef.current) {
				return;
			}

			UIManager.measure(target, (_x, _y, _width, height, _pageX, pageY) => {
				const keyboardTop = Dimensions.get('window').height - keyboardHeightRef.current;
				const inputBottom = pageY + height;
				const overlap = inputBottom - keyboardTop + KEYBOARD_EXTRA_OFFSET;

				if (overlap > 0) {
					scrollRef.current?.scrollTo({
						y: scrollYRef.current + overlap,
						animated: true,
					});
				}
			});
		};

		const showSubscription = Keyboard.addListener('keyboardDidShow', (event) => {
			const height = event.endCoordinates.height;
			keyboardHeightRef.current = height;
			setKeyboardHeight(height);

			const focusedInput = TextInput.State.currentlyFocusedInput();
			const focusedInputHandle = focusedInput
				? (findNodeHandle(focusedInput as unknown as React.Component<any>) as number | null)
				: null;
			const target = pendingFocusedInputRef.current ?? focusedInputHandle;
			if (target) {
				setTimeout(() => scrollToFocusedInput(target), 40);
			}
		});
		const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
			keyboardHeightRef.current = 0;
			setKeyboardHeight(0);
			pendingFocusedInputRef.current = null;
		});
		const focusSubscription = DeviceEventEmitter.addListener(
			'studmart:input-focus',
			(target: number) => {
				pendingFocusedInputRef.current = target;
				setTimeout(() => scrollToFocusedInput(target), 40);
			},
		);

		return () => {
			showSubscription.remove();
			hideSubscription.remove();
			focusSubscription.remove();
		};
	}, []);

	const dynamicContentContainerStyle = useMemo<ViewStyle>(
		() => ({
			paddingBottom:
				BASE_CONTENT_BOTTOM_PADDING +
				keyboardHeight +
				(keyboardHeight > 0 ? KEYBOARD_EXTRA_OFFSET : 0),
		}),
		[keyboardHeight],
	);

	return (
		<KeyboardAvoidingView
			style={styles.keyboardAvoiding}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<ScrollView
				{...rest}
				ref={scrollRef}
				style={[styles.scroll, rest.style]}
				onScroll={(event) => {
					scrollYRef.current = event.nativeEvent.contentOffset.y;
					rest.onScroll?.(event);
				}}
				scrollEventThrottle={16}
				contentContainerStyle={[contentContainerStyle, dynamicContentContainerStyle]}
				keyboardShouldPersistTaps={keyboardShouldPersistTaps ?? 'handled'}
				keyboardDismissMode={keyboardDismissMode ?? (Platform.OS === 'ios' ? 'interactive' : 'on-drag')}
				automaticallyAdjustKeyboardInsets
			>
				{children}
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	keyboardAvoiding: {
		flex: 1,
	},
	scroll: {
		flex: 1,
	},
});
