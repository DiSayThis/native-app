import { useMemo, useState } from 'react';

import {
	ActivityIndicator,
	Image,
	Linking,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';

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

import { FILE_API } from '@/shared/api/urls';
import { normalizeRichText, normalizeSiteUrl } from '@/shared/lib/partner-offer-utils';
import { lightTheme } from '@/shared/styles/tokens';
import Button from '@/shared/ui/Button';
import MarkdownText from '@/shared/ui/MarkdownText';
import ModalSlide from '@/shared/ui/ModalSlide';

const PARTNER_IMAGE_PLACEHOLDER = require('../shared/assets/placeholder.jpg');
const FIXED_HEADER_HEIGHT = 56;
const FIXED_HEADER_GRADIENT_HEIGHT = 96;

type PartnerOfferPageProps = {
	partnerId?: string;
	returnTo?: string;
};

export default function PartnerOfferPage({ partnerId, returnTo }: PartnerOfferPageProps) {
	const { id: studentId } = useAtomValue(authAtom);
	const { partner, discounts, isLoading, isError, refetch } = usePartnerOfferData(
		partnerId,
		studentId,
	);
	const [isImageLoading, setIsImageLoading] = useState(true);
	const [hasImageError, setHasImageError] = useState(false);
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
				<ActivityIndicator color={lightTheme.colors.accentColor} />
			</View>
		);
	}

	if (isError || !partner) {
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
			const isSupported = await Linking.canOpenURL(siteUrl);
			if (!isSupported) {
				return;
			}
			await Linking.openURL(siteUrl);
		} finally {
			setIsOpeningSite(false);
		}
	};

	const handleBack = () => {
		if (returnTo) {
			router.replace(returnTo);
			return;
		}

		router.replace('/discounts');
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
							<Stop offset="0" stopColor={lightTheme.colors.background} stopOpacity="1" />
							<Stop offset="0.4" stopColor={lightTheme.colors.background} stopOpacity="1" />
							<Stop offset="1" stopColor={lightTheme.colors.background} stopOpacity="0" />
						</LinearGradient>
					</Defs>
					<Rect x="0" y="0" width="100%" height="100%" fill="url(#partnerOfferHeaderGradient)" />
				</Svg>

				<View style={styles.fixedHeaderContent}>
					<View style={styles.headerRow}>
						<View style={styles.headerMain}>
							<Pressable style={styles.backButton} onPress={() => router.back()}>
								<ArrowLeft size={18} color={lightTheme.colors.textColor} />
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
										color={isFavorite ? '#EAB308' : lightTheme.colors.textColor}
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
						<Image
							source={PARTNER_IMAGE_PLACEHOLDER}
							style={styles.partnerImage}
							resizeMode="cover"
						/>
						{hasImageError ? null : (
							<Image
								source={{ uri: `${FILE_API}/Partners/${partner.id}` }}
								style={[
									styles.partnerImage,
									styles.networkImage,
									isImageLoading ? styles.networkImageHidden : null,
								]}
								resizeMode="cover"
								onLoadStart={() => {
									setIsImageLoading(true);
									setHasImageError(false);
								}}
								onLoad={() => {
									setIsImageLoading(false);
								}}
								onError={() => {
									setHasImageError(true);
									setIsImageLoading(false);
								}}
							/>
						)}
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
					{discounts.length > 0 ? (
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
	scroll: {
		flex: 1,
	},
	content: {
		paddingHorizontal: lightTheme.spacing.x4,
		paddingTop: FIXED_HEADER_HEIGHT + lightTheme.spacing.x4,
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
		paddingHorizontal: lightTheme.spacing.x4,
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
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: 24,
		fontWeight: 700,
		color: lightTheme.colors.textColor,
		alignContent: 'center',
		justifyContent: 'center',
		textAlign: 'center',
	},
	centerState: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: lightTheme.spacing.x4,
		backgroundColor: lightTheme.colors.background,
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
	favoriteButton: {
		flexShrink: 0,
		height: 36,
		width: 36,
		borderRadius: 90,
		backgroundColor: lightTheme.colors.clearWhite,
		borderWidth: 1,
		borderColor: lightTheme.colors.borderColor,
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
		backgroundColor: lightTheme.colors.borderColor,
	},
	networkImage: {
		position: 'absolute',
		top: 0,
		left: 0,
	},
	networkImageHidden: {
		opacity: 0,
	},
	partnerSubtitle: {
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: 16,
		color: lightTheme.colors.textColor,
		opacity: 0.8,
	},
	section: {
		gap: 10,
	},
	sectionTitle: {
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: 24,
		fontWeight: 700,
		color: lightTheme.colors.textColor,
	},
	emptyCard: {
		borderRadius: 14,
		padding: 16,
		borderWidth: 1,
		borderColor: lightTheme.colors.borderColor,
		backgroundColor: lightTheme.colors.clearWhite,
	},
	emptyText: {
		fontFamily: lightTheme.typography.fontFamily,
		fontSize: 15,
		color: lightTheme.colors.labelColor,
		textAlign: 'center',
	},
	errorText: {
		fontFamily: lightTheme.typography.fontFamily,
		fontSize: 15,
		color: lightTheme.colors.error,
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
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: 22,
		fontWeight: 700,
		color: lightTheme.colors.textColor,
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
