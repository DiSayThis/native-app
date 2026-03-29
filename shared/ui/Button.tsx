import React, { useMemo, useRef } from 'react';

import {
	Animated,
	type GestureResponderEvent,
	Pressable,
	type PressableProps,
	StyleSheet,
} from 'react-native';

import { type AppTheme } from '../styles/tokens';

import { useTheme } from './theme/ThemeProvider';

type ButtonVariant = 'primary' | 'secondary' | 'white';

interface IButtonProps extends PressableProps {
	title?: string;
	children?: React.ReactNode;
	variant?: ButtonVariant;
}

const variantColors = (theme: AppTheme) =>
	({
		primary: {
			background: theme.colors.accentColor,
			backgroundHover: theme.colors.accentHoverColor,
			text: theme.colors.accentTextColor,
			textHover: theme.colors.accentHoverTextColor,
			borderColor: 'transparent',
		},
		secondary: {
			background: theme.colors.bgWhite,
			backgroundHover: theme.colors.hoverBgSecondary,
			text: theme.colors.textColor,
			textHover: theme.colors.textColor,
			borderColor: theme.colors.borderColor,
		},
		white: {
			background: theme.colors.clearWhite,
			backgroundHover: theme.colors.hoverBgSecondary,
			text: theme.colors.textColor,
			textHover: theme.colors.textColor,
			borderColor: theme.colors.borderColor,
		},
	}) as const;

export default function Button({ title, children, variant = 'primary', ...rest }: IButtonProps) {
	const animatedValue = useRef(new Animated.Value(100)).current;
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);
	const colors = variantColors(theme)[variant];
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

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
		button: {
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: theme.radius,
			height: 58,
			borderWidth: 1,
		},
		text: {
			fontSize: theme.typography.fontSizeButtons,
			fontWeight: 700,
			fontFamily: theme.typography.fontFamilyHeadings,
			paddingHorizontal: theme.spacing.x2,
		},
	});
