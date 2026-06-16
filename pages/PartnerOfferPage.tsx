import { useMemo, useState } from 'react';

import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { router } from 'expo-router';
import { useAtomValue } from 'jotai';
import { ArrowLeft, Star } from 'lucide-react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { usePartnerFavoriteToggle } from '@/features/favorites/hook/usePartnerFavoriteToggle';
import { usePartnerOfferData } from '@/features/partner-offer/hook/usePartnerOfferData';

import { authAtom } from '@/entities/auth/model/auth.store';
import { DiscountCard } from '@/entities/partner/ui/DiscountCard';
import { PartnerImage } from '@/entities/partner/ui/PartnerImage';

import { openExternalUrl } from '@/shared/lib/open-external-url';
import { normalizeRichText, normalizeSiteUrl } from '@/shared/lib/partner-offer-utils';
import { type AppTheme } from '@/shared/styles/tokens';
import Button from '@/shared/ui/Button';
import MarkdownText from '@/shared/ui/MarkdownText';
import ModalSlide from '@/shared/ui/ModalSlide';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

const FIXED_HEADER_HEIGHT = 56;
const FIXED_HEADER_GRADIENT_HEIGHT = 96;

type PartnerOfferPageProps = {
	partnerId?: string;
	returnTo?: string;
};

export default function PartnerOfferPage({ partnerId }: PartnerOfferPageProps) {
	const { id: studentId } = useAtomValue(authAtom);
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);
	const { partner, discounts, isLoading, isErrorPartner, isErrorDiscounts, refetch } =
		usePartnerOfferData(partnerId, studentId);
	const [isOpeningSite, setIsOpeningSite] = useState(false);
	const [isDescriptionModalVisible, setIsDescriptionModalVisible] = useState(false);
	const starScale = useSharedValue(1);
	const starRotate = useSharedValue(0);
	const hasValidId = Boolean(partnerId?.trim());
	const { isFavorite, canToggleFavorite, isToggling, toggleFavorite } = usePartnerFavoriteToggle({
		partnerId: partnerId ?? '',
	});

	const cleanSubtitle = useMemo(() => normalizeRichText(partner?.subtitle), [partner?.subtitle]);

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

	if (!hasValidId) {
		return (
			<View style={styles.centerState}>
				<Text style={styles.errorText}>Не удалось определить предложение партнера</Text>
				<View style={styles.stateActionButton}>
					<Button title="Назад" onPress={() => router.back()} />
				</View>
			</View>
		);
	}

	if (isLoading) {
		return (
			<View style={styles.centerState}>
				<ActivityIndicator color={theme.colors.accentColor} />
			</View>
		);
	}

	if (isErrorPartner || !partner) {
		return (
			<View style={styles.centerState}>
				<Text style={styles.errorText}>Не удалось загрузить данные партнера</Text>
				<View style={styles.stateActionButton}>
					<Button title="Повторить" onPress={() => void refetch()} />
				</View>
			</View>
		);
	}

	const siteUrl = normalizeSiteUrl(partner.site);
	const canOpenSite = Boolean(siteUrl);

	const handleOpenSite = async () => {
		if (!siteUrl) {
			return;
		}

		try {
			setIsOpeningSite(true);
			await openExternalUrl(siteUrl);
		} finally {
			setIsOpeningSite(false);
		}
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
						<LinearGradient id="partnerOfferHeaderGradient" x1="0" y1="0" x2="0" y2="1">
							<Stop offset="0" stopColor={theme.colors.background} stopOpacity="1" />
							<Stop offset="0.4" stopColor={theme.colors.background} stopOpacity="1" />
							<Stop offset="1" stopColor={theme.colors.background} stopOpacity="0" />
						</LinearGradient>
					</Defs>
					<Rect x="0" y="0" width="100%" height="100%" fill="url(#partnerOfferHeaderGradient)" />
				</Svg>

				<View style={styles.fixedHeaderContent}>
					<View style={styles.headerRow}>
						<View style={styles.headerMain}>
							<Pressable style={styles.backButton} onPress={() => router.back()}>
								<ArrowLeft size={18} color={theme.colors.textColor} />
							</Pressable>
							<Text style={styles.headerTitle} numberOfLines={1}>
								{partner.companyName}
							</Text>
						</View>

						{canToggleFavorite ? (
							<Pressable
								style={styles.favoriteButton}
								disabled={isToggling}
								onPress={() => {
									animateStarPress();
									void toggleFavorite();
								}}
							>
								<Animated.View style={animatedStarStyle}>
									<Star
										size={18}
										color={isFavorite ? '#EAB308' : theme.colors.textColor}
										fill={isFavorite ? '#EAB308' : 'transparent'}
									/>
								</Animated.View>
							</Pressable>
						) : null}
					</View>
				</View>
			</View>

			<ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
				<View style={styles.partnerCard}>
					<View style={styles.imageContainer}>
						<PartnerImage partnerId={partner.id} style={styles.partnerImage} />
					</View>
					{cleanSubtitle ? <Text style={styles.partnerSubtitle}>{cleanSubtitle}</Text> : null}
					{partner?.description ? (
						<Button
							title="Открыть описание"
							variant="white"
							onPress={() => setIsDescriptionModalVisible(true)}
						/>
					) : null}

					{canOpenSite ? (
						<Button
							title={isOpeningSite ? 'Открытие...' : 'Перейти на сайт'}
							onPress={() => void handleOpenSite()}
							disabled={isOpeningSite}
						/>
					) : null}
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Предложения</Text>
					{!isErrorDiscounts && discounts.length > 0 ? (
						discounts.map((discount) => (
							<DiscountCard key={discount.id} discount={discount} studentId={studentId} />
						))
					) : (
						<View style={styles.emptyCard}>
							<Text style={styles.emptyText}>У данного партнера нет предложений</Text>
						</View>
					)}
				</View>
			</ScrollView>

			<ModalSlide
				visible={isDescriptionModalVisible}
				onClose={() => setIsDescriptionModalVisible(false)}
				contentStyle={styles.modalCard}
			>
				<Text style={styles.modalTitle}>О партнере</Text>
				<ScrollView
					style={styles.modalDescriptionScroll}
					contentContainerStyle={styles.modalDescriptionContent}
					showsVerticalScrollIndicator={false}
				>
					<MarkdownText content={partner?.description} />
				</ScrollView>
				<View style={styles.modalButtons}>
					{canOpenSite ? (
						<Button
							title={isOpeningSite ? 'Открытие...' : 'Перейти на сайт'}
							onPress={() => void handleOpenSite()}
							disabled={isOpeningSite}
						/>
					) : null}
					<Button
						title="Закрыть"
						variant="secondary"
						onPress={() => setIsDescriptionModalVisible(false)}
					/>
				</View>
			</ModalSlide>
		</View>
	);
}

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.colors.background,
		},
		scroll: {
			flex: 1,
		},
		content: {
			paddingHorizontal: theme.spacing.x4,
			paddingTop: FIXED_HEADER_HEIGHT + theme.spacing.x4,
			paddingBottom: 120,
			gap: 16,
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
			...StyleSheet.absoluteFillObject,
		},
		fixedHeaderContent: {
			height: FIXED_HEADER_HEIGHT,
			paddingHorizontal: theme.spacing.x4,
			justifyContent: 'center',
		},
		headerRow: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: 8,
		},
		headerMain: {
			flex: 1,
			minWidth: 0,
			flexDirection: 'row',
			alignItems: 'center',
			gap: 8,
		},
		headerTitle: {
			flex: 1,
			fontFamily: theme.typography.fontFamilyHeadings,
			fontSize: 24,
			fontWeight: 700,
			color: theme.colors.textColor,
			alignContent: 'center',
			justifyContent: 'center',
			textAlign: 'center',
		},
		centerState: {
			flex: 1,
			alignItems: 'center',
			justifyContent: 'center',
			padding: theme.spacing.x4,
			backgroundColor: theme.colors.background,
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
		favoriteButton: {
			flexShrink: 0,
			height: 36,
			width: 36,
			borderRadius: 90,
			backgroundColor: theme.colors.clearWhite,
			borderWidth: 1,
			borderColor: theme.colors.borderColor,
			alignItems: 'center',
			justifyContent: 'center',
		},
		partnerCard: {
			gap: 10,
		},
		imageContainer: {
			position: 'relative',
			width: '100%',
			borderRadius: 14,
			overflow: 'hidden',
			aspectRatio: 16 / 7,
		},
		partnerImage: {
			...StyleSheet.absoluteFillObject,
			backgroundColor: theme.colors.borderColor,
		},
		partnerSubtitle: {
			fontFamily: theme.typography.fontFamilyHeadings,
			fontSize: 16,
			color: theme.colors.textColor,
			opacity: 0.8,
		},
		section: {
			gap: 10,
		},
		sectionTitle: {
			fontFamily: theme.typography.fontFamilyHeadings,
			fontSize: 24,
			fontWeight: 700,
			color: theme.colors.textColor,
		},
		emptyCard: {
			borderRadius: 14,
			padding: 16,
			borderWidth: 1,
			borderColor: theme.colors.borderColor,
			backgroundColor: theme.colors.clearWhite,
		},
		emptyText: {
			fontFamily: theme.typography.fontFamily,
			fontSize: 15,
			color: theme.colors.labelColor,
			textAlign: 'center',
		},
		errorText: {
			fontFamily: theme.typography.fontFamily,
			fontSize: 15,
			color: theme.colors.error,
			textAlign: 'center',
			marginBottom: 12,
		},
		stateActionButton: {
			width: '100%',
			maxWidth: 260,
			marginTop: 8,
		},
		modalCard: {
			maxHeight: '85%',
			gap: 12,
		},
		modalTitle: {
			fontFamily: theme.typography.fontFamilyHeadings,
			fontSize: 22,
			fontWeight: 700,
			color: theme.colors.textColor,
		},
		modalDescriptionScroll: {
			flexGrow: 0,
		},
		modalDescriptionContent: {
			paddingBottom: 4,
		},
		modalButtons: {
			gap: 10,
		},
	});
