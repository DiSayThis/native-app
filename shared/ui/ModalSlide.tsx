import { useEffect, useMemo, useState } from 'react';

import { Modal, Pressable, type StyleProp, StyleSheet, type ViewStyle } from 'react-native';

import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
}: IModalSlideProps) {
	const [isMounted, setIsMounted] = useState(visible);
	const insets = useSafeAreaInsets();
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);
	const overlayOpacity = useSharedValue(visible ? 1 : 0);
	const contentTranslateY = useSharedValue(visible ? 0 : 28);
	const contentOpacity = useSharedValue(visible ? 1 : 0);

	const overlayAnimatedStyle = useAnimatedStyle(() => ({
		opacity: overlayOpacity.value,
	}));

	const contentAnimatedStyle = useAnimatedStyle(() => ({
		opacity: contentOpacity.value,
		transform: [{ translateY: contentTranslateY.value }],
	}));

	useEffect(() => {
		const contentEnterDuration = enterDuration;
		const overlayEnterDuration = enterDuration + 40;
		const contentExitDuration = exitDuration;
		const overlayExitDuration = exitDuration + 40;

		if (visible) {
			setIsMounted(true);
			overlayOpacity.value = 0;
			contentTranslateY.value = 28;
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
		}, overlayExitDuration);

		return () => clearTimeout(unmountTimeout);
	}, [contentOpacity, contentTranslateY, enterDuration, exitDuration, overlayOpacity, visible]);

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
				<Animated.View
					style={[
						styles.content,
						{ paddingBottom: Math.max(20, insets.bottom + 8) },
						contentStyle,
						contentAnimatedStyle,
					]}
				>
					{children}
				</Animated.View>
			</Animated.View>
		</Modal>
	);
}

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
		overlay: {
			flex: 1,
			justifyContent: 'flex-end',
		},
		content: {
			padding: 16,
			borderTopLeftRadius: 18,
			borderTopRightRadius: 18,
			backgroundColor: theme.colors.bgWhite,
			overflow: 'hidden',
		},
	});
