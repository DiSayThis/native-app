import { useEffect, useMemo, useRef, useState } from 'react';

import {
	DeviceEventEmitter,
	Dimensions,
	findNodeHandle,
	Keyboard,
	KeyboardAvoidingView,
	type NativeScrollEvent,
	type NativeSyntheticEvent,
	Platform,
	Pressable,
	ScrollView,
	type StyleProp,
	StyleSheet,
	Text,
	TextInput,
	UIManager,
	View,
	type ViewStyle,
} from 'react-native';

import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { type AppTheme } from '@/shared/styles/tokens';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

const FIXED_HEADER_HEIGHT = 84;
const FIXED_HEADER_GRADIENT_HEIGHT = 132;
const KEYBOARD_EXTRA_OFFSET = 40;
const BASE_CONTENT_BOTTOM_PADDING = 44;

interface IGradientBackHeaderLayoutProps {
	title: string;
	children: React.ReactNode;
	contentContainerStyle?: StyleProp<ViewStyle>;
	onBack?: () => void;
}

export default function GradientBackHeaderLayout({
	title,
	children,
	contentContainerStyle,
	onBack,
}: IGradientBackHeaderLayoutProps) {
	const scrollRef = useRef<ScrollView>(null);
	const scrollYRef = useRef(0);
	const keyboardHeightRef = useRef(0);
	const pendingFocusedInputRef = useRef<number | null>(null);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const router = useRouter();
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);

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

	const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		scrollYRef.current = event.nativeEvent.contentOffset.y;
	};

	const dynamicBottomPadding =
		BASE_CONTENT_BOTTOM_PADDING + keyboardHeight + (keyboardHeight > 0 ? KEYBOARD_EXTRA_OFFSET : 0);

	const handleBack = () => {
		if (onBack) {
			onBack();
			return;
		}

		router.back();
	};

	return (
		<View style={styles.container}>
			<View style={styles.fixedHeaderContainer}>
				<Svg
					style={styles.fixedHeaderGradient}
					width="100%"
					height="100%"
					preserveAspectRatio="none"
				>
					<Defs>
						<LinearGradient id="screenHeaderGradient" x1="0" y1="0" x2="0" y2="1">
							<Stop offset="0" stopColor={theme.colors.background} stopOpacity="1" />
							<Stop offset="0.4" stopColor={theme.colors.background} stopOpacity="1" />
							<Stop offset="1" stopColor={theme.colors.background} stopOpacity="0" />
						</LinearGradient>
					</Defs>
					<Rect x="0" y="0" width="100%" height="100%" fill="url(#screenHeaderGradient)" />
				</Svg>

				<View style={styles.fixedHeaderContent}>
					<View style={styles.headerRow}>
						<Pressable style={styles.backButton} onPress={handleBack}>
							<ArrowLeft size={18} color={theme.colors.textColor} />
						</Pressable>
						<Text style={styles.headerTitle}>{title}</Text>
					</View>
				</View>
			</View>

			<KeyboardAvoidingView
				style={styles.keyboardAvoiding}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			>
				<ScrollView
					ref={scrollRef}
					style={styles.scroll}
					onScroll={handleScroll}
					scrollEventThrottle={16}
					contentContainerStyle={[
						styles.content,
						{
							paddingBottom: dynamicBottomPadding,
						},
						contentContainerStyle,
					]}
					keyboardShouldPersistTaps="handled"
					keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
					automaticallyAdjustKeyboardInsets
				>
					{children}
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.colors.background,
		},
		fixedHeaderContainer: {
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			height: FIXED_HEADER_GRADIENT_HEIGHT,
			zIndex: 10,
		},
		fixedHeaderGradient: {
			...StyleSheet.absoluteFill,
		},
		fixedHeaderContent: {
			height: FIXED_HEADER_HEIGHT,
			paddingHorizontal: theme.spacing.x4,
			justifyContent: 'center',
		},
		headerRow: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: 10,
		},
		backButton: {
			flexShrink: 0,
			height: 36,
			width: 36,
			justifyContent: 'center',
			paddingHorizontal: 10,
			borderRadius: 90,
			backgroundColor: theme.colors.clearWhite,
			borderWidth: 1,
			borderColor: theme.colors.borderColor,
			flexDirection: 'row',
			alignItems: 'center',
			gap: 6,
		},
		headerTitle: {
			flex: 1,
			flexShrink: 1,
			fontFamily: theme.typography.fontFamilyHeadings,
			fontSize: 22,
			lineHeight: 26,
			color: theme.colors.textColor,
		},
		scroll: {
			flex: 1,
		},
		keyboardAvoiding: {
			flex: 1,
		},
		content: {
			paddingTop: FIXED_HEADER_HEIGHT + theme.spacing.x4,
			paddingHorizontal: theme.spacing.x4,
			paddingBottom: 24,
		},
	});
