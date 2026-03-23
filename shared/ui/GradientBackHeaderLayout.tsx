import {
	Pressable,
	ScrollView,
	type StyleProp,
	StyleSheet,
	Text,
	View,
	type ViewStyle,
} from 'react-native';

import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { lightTheme } from '@/shared/styles/tokens';

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
							<Stop offset="0" stopColor={lightTheme.colors.background} stopOpacity="1" />
							<Stop offset="0.4" stopColor={lightTheme.colors.background} stopOpacity="1" />
							<Stop offset="1" stopColor={lightTheme.colors.background} stopOpacity="0" />
						</LinearGradient>
					</Defs>
					<Rect x="0" y="0" width="100%" height="100%" fill="url(#screenHeaderGradient)" />
				</Svg>

				<View style={styles.fixedHeaderContent}>
					<View style={styles.headerRow}>
						<Pressable style={styles.backButton} onPress={handleBack}>
							<ArrowLeft size={18} color={lightTheme.colors.textColor} />
						</Pressable>
						<Text style={styles.headerTitle}>{title}</Text>
					</View>
				</View>
			</View>

			<ScrollView
				style={styles.scroll}
				contentContainerStyle={[styles.content, contentContainerStyle]}
			>
				{children}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
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
		paddingHorizontal: lightTheme.spacing.x4,
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
		backgroundColor: lightTheme.colors.clearWhite,
		borderWidth: 1,
		borderColor: lightTheme.colors.borderColor,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	headerTitle: {
		flex: 1,
		flexShrink: 1,
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: 22,
		lineHeight: 26,
		color: lightTheme.colors.textColor,
	},
	scroll: {
		flex: 1,
	},
	content: {
		paddingTop: FIXED_HEADER_HEIGHT + lightTheme.spacing.x4,
		paddingHorizontal: lightTheme.spacing.x4,
		paddingBottom: 24,
	},
});
