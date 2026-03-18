import { useEffect, useState } from 'react';

import { Modal, Pressable, type StyleProp, StyleSheet, type ViewStyle } from 'react-native';

import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { lightTheme } from '../styles/tokens';

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
	enterDuration = 220,
	exitDuration = 180,
}: IModalSlideProps) {
	const [isMounted, setIsMounted] = useState(visible);
	const overlayOpacity = useSharedValue(visible ? 1 : 0);
	const contentTranslateY = useSharedValue(visible ? 0 : 24);

	const overlayAnimatedStyle = useAnimatedStyle(() => ({
		opacity: overlayOpacity.value,
	}));

	const contentAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: contentTranslateY.value }],
	}));

	useEffect(() => {
		if (visible) {
			setIsMounted(true);
			overlayOpacity.value = 0;
			contentTranslateY.value = 24;
			overlayOpacity.value = withTiming(1, { duration: enterDuration });
			contentTranslateY.value = withTiming(0, { duration: enterDuration });
			return;
		}

		overlayOpacity.value = withTiming(0, { duration: exitDuration });
		contentTranslateY.value = withTiming(24, { duration: exitDuration });

		const unmountTimeout = setTimeout(() => {
			setIsMounted(false);
		}, exitDuration);

		return () => clearTimeout(unmountTimeout);
	}, [contentTranslateY, enterDuration, exitDuration, overlayOpacity, visible]);

	return (
		<Modal visible={isMounted} animationType="none" transparent onRequestClose={onClose}>
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
				<Animated.View style={[styles.content, contentStyle, contentAnimatedStyle]}>
					{children}
				</Animated.View>
			</Animated.View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		justifyContent: 'flex-end',
	},
	content: {
		padding: 16,
		paddingBottom: 20,
		borderTopLeftRadius: 18,
		borderTopRightRadius: 18,
		backgroundColor: lightTheme.colors.clearWhite,
	},
});
