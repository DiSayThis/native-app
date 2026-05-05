import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
	KeyboardAvoidingView,
	Modal,
	Pressable,
	type StyleProp,
	StyleSheet,
	useWindowDimensions,
	View,
	type ViewStyle,
} from 'react-native';

import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
	Easing,
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useOverlayBackDismiss } from '../lib/use-overlay-back-dismiss';
import { type AppTheme } from '../styles/tokens';

import { useTheme } from './theme/ThemeProvider';

interface IModalSlideProps {
	visible: boolean;
	onClose: () => void;
	children: React.ReactNode;
	contentStyle?: StyleProp<ViewStyle>;
	closeOnBackdropPress?: boolean;
	backdropOpacity?: number;
	enterDuration?: number;
	exitDuration?: number;
	enableSwipeToClose?: boolean;
	showHandle?: boolean;
	swipeCloseThreshold?: number;
	swipeVelocityThreshold?: number;
}

export default function ModalSlide({
	visible,
	onClose,
	children,
	contentStyle,
	closeOnBackdropPress = true,
	backdropOpacity: targetBackdropOpacity = 0.4,
	enterDuration = 280,
	exitDuration = 220,
	enableSwipeToClose = true,
	showHandle = true,
	swipeCloseThreshold = 0.22,
	swipeVelocityThreshold = 1000,
}: IModalSlideProps) {
	const [isMounted, setIsMounted] = useState(visible);
	const isGestureClosingRef = useRef(false);
	const insets = useSafeAreaInsets();
	const { width, height } = useWindowDimensions();
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);
	const isWideLayout = width > height || width >= 768;
	const containerSafeAreaStyle = useMemo(
		() => ({
			paddingLeft: isWideLayout ? Math.max(theme.spacing.x4, insets.left) : insets.left,
			paddingRight: isWideLayout ? Math.max(theme.spacing.x4, insets.right) : insets.right,
			paddingTop: isWideLayout ? Math.max(theme.spacing.x4, insets.top) : 0,
			paddingBottom: isWideLayout ? Math.max(theme.spacing.x4, insets.bottom) : 0,
		}),
		[isWideLayout, insets.bottom, insets.left, insets.right, insets.top, theme.spacing.x4],
	);
	const overlayOpacity = useSharedValue(visible ? 1 : 0);
	const contentTranslateY = useSharedValue(visible ? 0 : 28);
	const contentDragY = useSharedValue(0);
	const contentOpacity = useSharedValue(visible ? 1 : 0);
	const contentHeight = useSharedValue(1);

	const handleSwipeClose = useCallback(() => {
		isGestureClosingRef.current = true;
		onClose();
	}, [onClose]);

	useOverlayBackDismiss({
		enabled: visible,
		onDismiss: onClose,
	});

	const overlayAnimatedStyle = useAnimatedStyle(() => ({
		opacity:
			overlayOpacity.value *
			(1 - Math.min(contentDragY.value / Math.max(contentHeight.value, 1), 1) * 0.65),
	}));

	const contentAnimatedStyle = useAnimatedStyle(() => ({
		opacity: contentOpacity.value,
		transform: [{ translateY: contentTranslateY.value + contentDragY.value }],
	}));

	const swipeDownGesture = useMemo(
		() =>
			Gesture.Pan()
				.enabled(isMounted && enableSwipeToClose)
				.activeOffsetY(10)
				.failOffsetX([-24, 24])
				.onUpdate((event) => {
					contentDragY.value = Math.max(0, event.translationY);
				})
				.onEnd((event) => {
					const shouldClose =
						event.translationY > contentHeight.value * swipeCloseThreshold ||
						event.velocityY > swipeVelocityThreshold;

					if (shouldClose) {
						contentDragY.value = withTiming(
							Math.max(contentDragY.value, 48),
							{
								duration: 120,
								easing: Easing.out(Easing.quad),
							},
							(finished) => {
								if (finished) {
									runOnJS(handleSwipeClose)();
								}
							},
						);
						return;
					}

					contentDragY.value = withSpring(0, {
						damping: 22,
						stiffness: 260,
						mass: 0.75,
						velocity: event.velocityY / 1000,
					});
				}),
		[
			contentDragY,
			contentHeight,
			enableSwipeToClose,
			handleSwipeClose,
			isMounted,
			swipeCloseThreshold,
			swipeVelocityThreshold,
		],
	);

	useEffect(() => {
		const contentEnterDuration = enterDuration;
		const overlayEnterDuration = enterDuration + 40;
		const contentExitDuration = exitDuration;
		const overlayExitDuration = exitDuration + 40;

		if (visible) {
			setIsMounted(true);
			isGestureClosingRef.current = false;
			overlayOpacity.value = 0;
			contentTranslateY.value = 28;
			contentDragY.value = 0;
			contentOpacity.value = 0;
			overlayOpacity.value = withTiming(1, {
				duration: overlayEnterDuration,
				easing: Easing.out(Easing.linear),
			});
			contentTranslateY.value = withTiming(0, {
				duration: contentEnterDuration,
				easing: Easing.out(Easing.cubic),
			});
			contentOpacity.value = withTiming(1, {
				duration: contentEnterDuration - 20,
				easing: Easing.out(Easing.linear),
			});
			return;
		}

		if (!isGestureClosingRef.current) {
			contentDragY.value = withTiming(0, {
				duration: exitDuration,
				easing: Easing.inOut(Easing.quad),
			});
		}

		overlayOpacity.value = withTiming(0, {
			duration: overlayExitDuration,
			easing: Easing.in(Easing.quad),
		});
		contentTranslateY.value = withTiming(24, {
			duration: contentExitDuration,
			easing: Easing.in(Easing.cubic),
		});
		contentOpacity.value = withTiming(0, {
			duration: contentExitDuration - 20,
			easing: Easing.in(Easing.quad),
		});

		const unmountTimeout = setTimeout(() => {
			setIsMounted(false);
			contentDragY.value = 0;
			isGestureClosingRef.current = false;
		}, overlayExitDuration);

		return () => clearTimeout(unmountTimeout);
	}, [
		contentDragY,
		contentOpacity,
		contentTranslateY,
		enterDuration,
		exitDuration,
		overlayOpacity,
		visible,
	]);

	return (
		<Modal
			visible={isMounted}
			animationType="none"
			transparent
			presentationStyle="overFullScreen"
			statusBarTranslucent
			navigationBarTranslucent
			onRequestClose={onClose}
		>
			<GestureHandlerRootView style={styles.gestureRoot}>
				<Animated.View
					style={[
						styles.overlay,
						{ backgroundColor: `rgba(0, 0, 0, ${targetBackdropOpacity})` },
						overlayAnimatedStyle,
					]}
				>
					{closeOnBackdropPress ? (
						<Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
					) : null}
					<KeyboardAvoidingView
						style={[
							styles.keyboardAvoiding,
							isWideLayout ? styles.keyboardAvoidingCentered : null,
							containerSafeAreaStyle,
						]}
						behavior="padding"
						pointerEvents="box-none"
					>
						<Animated.View
							onLayout={(event) => {
								contentHeight.value = event.nativeEvent.layout.height || 1;
							}}
							style={[
								styles.content,
								isWideLayout ? styles.contentWide : null,
								{ paddingBottom: Math.max(20, insets.bottom + 8) },
								contentStyle,
								contentAnimatedStyle,
							]}
						>
							{enableSwipeToClose && showHandle && !isWideLayout ? (
								<GestureDetector gesture={swipeDownGesture}>
									<View style={styles.handleTouchArea}>
										<View style={styles.handle} />
									</View>
								</GestureDetector>
							) : null}
							{children}
						</Animated.View>
					</KeyboardAvoidingView>
				</Animated.View>
			</GestureHandlerRootView>
		</Modal>
	);
}

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
		gestureRoot: {
			flex: 1,
		},
		keyboardAvoiding: {
			flex: 1,
			justifyContent: 'flex-end',
		},
		keyboardAvoidingCentered: {
			justifyContent: 'center',
			paddingHorizontal: theme.spacing.x4,
		},
		overlay: {
			flex: 1,
		},
		content: {
			padding: 16,
			borderTopLeftRadius: 18,
			borderTopRightRadius: 18,
			backgroundColor: theme.colors.bgWhite,
			overflow: 'hidden',
			maxHeight: '92%',
		},
		contentWide: {
			alignSelf: 'center',
			width: '100%',
			maxWidth: 560,
			borderRadius: 18,
		},
		handleTouchArea: {
			width: '100%',
			minHeight: 30,
			alignItems: 'center',
			paddingTop: 4,
			paddingBottom: 12,
		},
		handle: {
			width: 44,
			height: 4,
			borderRadius: 999,
			backgroundColor: theme.colors.borderColor,
			opacity: 0.9,
		},
	});
