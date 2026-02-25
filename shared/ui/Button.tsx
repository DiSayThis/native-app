import React, { useRef } from 'react';

import {
	Animated,
	type GestureResponderEvent,
	Pressable,
	type PressableProps,
	StyleSheet,
} from 'react-native';

import { lightTheme } from '../styles/tokens';

type ButtonVariant = 'primary' | 'secondary';

interface IButtonProps extends PressableProps {
	title?: string;
	children?: React.ReactNode;
	variant?: ButtonVariant;
}

const variantColors = {
	primary: {
		background: lightTheme.colors.accentColor,
		backgroundHover: lightTheme.colors.accentHoverColor,
		text: lightTheme.colors.accentTextColor,
		textHover: lightTheme.colors.accentHoverTextColor,
		borderColor: 'transparent',
	},
	secondary: {
		background: lightTheme.colors.bgWhite,
		backgroundHover: lightTheme.colors.hoverBgSecondary,
		text: lightTheme.colors.textColor,
		textHover: lightTheme.colors.textColor,
		borderColor: lightTheme.colors.borderColor,
	},
} as const;

export default function Button({ title, children, variant = 'primary', ...rest }: IButtonProps) {
	const animatedValue = useRef(new Animated.Value(100)).current;
	const colors = variantColors[variant];
	const backgroundColorInterpolation = animatedValue.interpolate({
		inputRange: [0, 100],
		outputRange: [colors.backgroundHover, colors.background],
	});
	const colorInterpolation = animatedValue.interpolate({
		inputRange: [0, 100],
		outputRange: [colors.textHover, colors.text],
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
					borderColor: colors.borderColor,
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
		borderWidth: 1,
	},
	text: {
		fontSize: lightTheme.typography.fontSizeButtons,
		fontWeight: 700,
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		paddingHorizontal: lightTheme.spacing.x2,
	},
});
