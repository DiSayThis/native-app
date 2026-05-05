import { useMemo } from 'react';

import {
	Pressable,
	type StyleProp,
	StyleSheet,
	Text,
	useWindowDimensions,
	View,
	type ViewStyle,
} from 'react-native';

import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { type AppTheme } from '@/shared/styles/tokens';
import KeyboardAwareScrollView from '@/shared/ui/KeyboardAwareScrollView';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

const FIXED_HEADER_HEIGHT = 84;
const FIXED_HEADER_GRADIENT_HEIGHT = 132;

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
	const router = useRouter();
	const { width: viewportWidth } = useWindowDimensions();
	const insets = useSafeAreaInsets();
	const { theme } = useTheme();
	const styles = useMemo(
		() => createStyles(theme, insets.bottom + theme.spacing.x6),
		[insets.bottom, theme],
	);

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
					key={`screen-header-gradient-${viewportWidth}`}
					style={styles.fixedHeaderGradient}
					width={viewportWidth}
					height={FIXED_HEADER_GRADIENT_HEIGHT}
					viewBox={`0 0 ${viewportWidth} ${FIXED_HEADER_GRADIENT_HEIGHT}`}
					preserveAspectRatio="none"
				>
					<Defs>
						<LinearGradient id="screenHeaderGradient" x1="0" y1="0" x2="0" y2="1">
							<Stop offset="0" stopColor={theme.colors.background} stopOpacity="1" />
							<Stop offset="0.4" stopColor={theme.colors.background} stopOpacity="1" />
							<Stop offset="1" stopColor={theme.colors.background} stopOpacity="0" />
						</LinearGradient>
					</Defs>
					<Rect
						x="0"
						y="0"
						width={viewportWidth}
						height={FIXED_HEADER_GRADIENT_HEIGHT}
						fill="url(#screenHeaderGradient)"
					/>
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

			<KeyboardAwareScrollView contentContainerStyle={[styles.content, contentContainerStyle]}>
				{children}
			</KeyboardAwareScrollView>
		</View>
	);
}

const createStyles = (theme: AppTheme, bottomContentInset: number) =>
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
		content: {
			paddingTop: FIXED_HEADER_HEIGHT + theme.spacing.x4,
			paddingHorizontal: theme.spacing.x4,
			paddingBottom: bottomContentInset,
		},
	});
