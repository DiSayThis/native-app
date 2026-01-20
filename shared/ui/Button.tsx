import React from 'react';

import {
	Animated,
	type GestureResponderEvent,
	Pressable,
	type PressableProps,
	StyleSheet,
	Text,
} from 'react-native';

import { lightTheme } from '../styles/tokens';

interface IButtonProps extends PressableProps {
	title?: string;
}

export default function Button({ title, ...rest }: IButtonProps) {
	const animatedValue = new Animated.Value(100);
	const colorInterpolation = animatedValue.interpolate({
		inputRange: [0, 100],
		outputRange: [lightTheme.colors.accentHoverColor, lightTheme.colors.accentHoverColor],
	});

	const fadeIn = (e: GestureResponderEvent) => {
		Animated.timing(animatedValue, {
			toValue: 0,
			duration: 100,
			useNativeDriver: false,
		}).start();
		rest.onPressIn && rest.onPressIn(e);
	};
	const fadeOut = (e: GestureResponderEvent) => {
		Animated.timing(animatedValue, {
			toValue: 100,
			duration: 100,
			useNativeDriver: false,
		}).start();
		rest.onPressOut && rest.onPressOut(e);
	};

	return (
		<Pressable {...rest} onPressIn={fadeIn} onPressOut={fadeOut}>
			<Animated.View
				style={{
					...styles.button,
					backgroundColor: colorInterpolation,
				}}
			>
				<Text style={styles.text}>{title ?? 'Отправить'}</Text>
			</Animated.View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: lightTheme.radius,
		height: 58,
	},
	text: {
		fontSize: lightTheme.typography.fontSizeButtons,
		fontWeight: 700,
		color: lightTheme.colors.accentTextColor,
		fontFamily: lightTheme.typography.fontFamilyHeadings,
	},
});
