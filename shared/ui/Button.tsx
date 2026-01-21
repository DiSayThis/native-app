import React from 'react';

import {
	Animated,
	type GestureResponderEvent,
	Pressable,
	type PressableProps,
	StyleSheet,
} from 'react-native';

import { lightTheme } from '../styles/tokens';

interface IButtonProps extends PressableProps {
	title?: string;
	children?: React.ReactNode;
}

export default function Button({ title, children, ...rest }: IButtonProps) {
	const animatedValue = new Animated.Value(100);
	const backgroundColorInterpolation = animatedValue.interpolate({
		inputRange: [0, 100],
		outputRange: [lightTheme.colors.accentHoverColor, lightTheme.colors.accentColor],
	});
	const colorInterpolation = animatedValue.interpolate({
		inputRange: [0, 100],
		outputRange: [lightTheme.colors.accentHoverTextColor, lightTheme.colors.accentTextColor],
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
					backgroundColor: backgroundColorInterpolation,
				}}
			>
				<Animated.Text style={{ ...styles.text, color: colorInterpolation }}>
					{children ?? title ?? 'Отправить'}
				</Animated.Text>
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
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		paddingHorizontal: lightTheme.spacing.x2,
	},
});
