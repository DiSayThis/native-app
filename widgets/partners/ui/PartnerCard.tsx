import { memo, useMemo } from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { router } from 'expo-router';
import { Star } from 'lucide-react-native';
import Animated, {
	Easing,
	FadeInUp,
	FadeOutDown,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from 'react-native-reanimated';

import { usePartnerFavoriteToggle } from '@/features/favorites/hook/usePartnerFavoriteToggle';

import type { IPartnerCard } from '@/entities/partner/model/partner.dto';
import { PartnerImage } from '@/entities/partner/ui/PartnerImage';

import { type AppTheme } from '@/shared/styles/tokens';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

type PartnerCardProps = {
	item: IPartnerCard;
	index: number;
};

const ENTER_STAGGER_STEP = 40;
const ENTER_STAGGER_MAX_DELAY = 280;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const PartnerCard = memo(function PartnerCard({ item, index }: PartnerCardProps) {
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);
	const starScale = useSharedValue(1);
	const starRotate = useSharedValue(0);
	const enterDelay = Math.min(index * ENTER_STAGGER_STEP, ENTER_STAGGER_MAX_DELAY);
	const { isFavorite, canToggleFavorite, isToggling, toggleFavorite } = usePartnerFavoriteToggle({
		partnerId: item.id,
	});

	const animateStarPress = () => {
		starScale.value = 1;
		starRotate.value = 0;

		starScale.value = withTiming(1.25, { duration: 110 }, () => {
			starScale.value = withSpring(1, {
				stiffness: 300,
			});
		});

		starRotate.value = withTiming(18, { duration: 110 }, () => {
			starRotate.value = withTiming(0, { duration: 160 });
		});
	};

	const animatedStarStyle = useAnimatedStyle(() => ({
		transform: [{ scale: starScale.value }, { rotate: `${starRotate.value}deg` }],
	}));

	const enteringAnimation = useMemo(
		() => FadeInUp.duration(320).delay(enterDelay).easing(Easing.out(Easing.cubic)),
		[enterDelay],
	);

	const exitingAnimation = useMemo(
		() => FadeOutDown.duration(230).easing(Easing.in(Easing.cubic)),
		[],
	);

	return (
		<AnimatedPressable
			entering={enteringAnimation}
			exiting={exitingAnimation}
			style={[styles.card, item.isFixed ? styles.fixedCard : null]}
			onPress={() => router.push(`/partner-offer/${item.id}`)}
		>
			{canToggleFavorite ? (
				<Pressable
					style={styles.favoriteButton}
					disabled={isToggling}
					onPress={(event) => {
						event.stopPropagation();
						animateStarPress();
						void toggleFavorite();
					}}
				>
					<Animated.View style={animatedStarStyle}>
						<Star
							size={18}
							color={isFavorite ? '#EAB308' : '#fff'}
							fill={isFavorite ? '#EAB308' : 'transparent'}
						/>
					</Animated.View>
				</Pressable>
			) : null}
			<View style={styles.imageContainer}>
				<PartnerImage partnerId={item.id} style={styles.cardImage} />
			</View>
			<View style={styles.cardInfoRow}>
				<View style={styles.cardContent}>
					<Text style={styles.cardTitle}>{item.heading}</Text>
					<Text style={styles.cardSubtitle}>{item.subtitle}</Text>
				</View>
				<View style={styles.discountBadge}>
					<Text style={styles.discountText}>{item.discount ? `${item.discount}%` : '0%'}</Text>
				</View>
			</View>
		</AnimatedPressable>
	);
});

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
		card: {
			flex: 1,
			position: 'relative',
			borderRadius: 16,
			borderColor: theme.colors.borderColor,
			backgroundColor: theme.colors.clearWhite,
			gap: 8,
			shadowColor: theme.colors.shadowColor,
			shadowOffset: {
				width: 0,
				height: 6,
			},
			shadowOpacity: 0.12,
			shadowRadius: 8,
			elevation: 3,
		},
		favoriteButton: {
			position: 'absolute',
			top: 10,
			right: 10,
			width: 32,
			height: 32,
			borderRadius: 16,
			backgroundColor: 'rgba(0, 0, 0, 0.28)',
			alignItems: 'center',
			justifyContent: 'center',
			zIndex: 3,
		},
		imageContainer: {
			position: 'relative',
			width: '100%',
			height: 132,
			overflow: 'hidden',
			borderTopLeftRadius: 12,
			borderTopRightRadius: 12,
		},
		cardImage: {
			...StyleSheet.absoluteFillObject,
			backgroundColor: theme.colors.borderColor,
		},
		cardInfoRow: {
			paddingTop: 8,
			padding: 14,
			flexDirection: 'row',
			alignItems: 'flex-start',
			gap: 8,
		},
		fixedCard: {
			borderColor: theme.colors.accentColor,
		},
		discountBadge: {
			flexShrink: 0,
			paddingHorizontal: 10,
			paddingVertical: 4,
			borderRadius: 999,
			backgroundColor: theme.colors.accentColor,
		},
		discountText: {
			fontFamily: theme.typography.fontFamilyHeadings,
			color: theme.colors.accentTextColor,
			fontSize: 14,
			fontWeight: 700,
		},
		cardTitle: {
			fontFamily: theme.typography.fontFamilyHeadings,
			fontSize: 18,
			fontWeight: 700,
			color: theme.colors.textColor,
			flexShrink: 1,
		},
		cardContent: {
			flex: 1,
			minWidth: 0,
			gap: 8,
		},
		cardSubtitle: {
			fontFamily: theme.typography.fontFamily,
			fontSize: 14,
			color: theme.colors.textColor,
			opacity: 0.9,
			flexShrink: 1,
		},
	});
