import { memo, useState } from 'react';

import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { router } from 'expo-router';
import { Star } from 'lucide-react-native';

import type { IPartnerCard } from '@/features/discounts/model/discounts.dto';
import { usePartnerFavoriteToggle } from '@/features/favorites/hook/usePartnerFavoriteToggle';

import { FILE_API } from '@/shared/api/urls';
import { lightTheme } from '@/shared/styles/tokens';

const PARTNER_IMAGE_PLACEHOLDER = require('../../assets/placeholder.jpg');

type PartnerCardProps = {
	item: IPartnerCard;
};

export const PartnerCard = memo(function PartnerCard({ item }: PartnerCardProps) {
	const [isImageLoading, setIsImageLoading] = useState(true);
	const [hasImageError, setHasImageError] = useState(false);
	const { isFavorite, canToggleFavorite, isToggling, toggleFavorite } = usePartnerFavoriteToggle({
		partnerId: item.id,
	});

	return (
		<Pressable
			style={[styles.card, item.isFixed ? styles.fixedCard : null]}
			onPress={() => router.push(`/partner-offer/${item.id}`)}
		>
			{canToggleFavorite ? (
				<Pressable
					style={styles.favoriteButton}
					disabled={isToggling}
					onPress={(event) => {
						event.stopPropagation();
						void toggleFavorite();
					}}
				>
					<Star
						size={18}
						color={isFavorite ? '#EAB308' : lightTheme.colors.clearWhite}
						fill={isFavorite ? '#EAB308' : 'transparent'}
					/>
				</Pressable>
			) : null}
			<View style={styles.imageContainer}>
				<Image source={PARTNER_IMAGE_PLACEHOLDER} style={styles.cardImage} resizeMode="cover" />
				{hasImageError ? null : (
					<Image
						source={{ uri: `${FILE_API}/Partners/${item.id}` }}
						style={[
							styles.cardImage,
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
			<View style={styles.cardInfoRow}>
				<View style={styles.cardContent}>
					<Text style={styles.cardTitle}>{item.heading}</Text>
					<Text style={styles.cardSubtitle}>{item.subtitle}</Text>
				</View>
				<View style={styles.discountBadge}>
					<Text style={styles.discountText}>{item.discount ? `${item.discount}%` : '0%'}</Text>
				</View>
			</View>
		</Pressable>
	);
});

const styles = StyleSheet.create({
	card: {
		flex: 1,
		position: 'relative',
		borderRadius: 16,
		// borderWidth: 1,
		borderColor: lightTheme.colors.borderColor,
		backgroundColor: lightTheme.colors.clearWhite,
		gap: 8,
		shadowColor: '#000',
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
	cardInfoRow: {
		paddingTop: 8,
		padding: 14,
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: 8,
	},
	fixedCard: {
		borderColor: lightTheme.colors.accentColor,
	},
	discountBadge: {
		flexShrink: 0,
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 999,
		backgroundColor: lightTheme.colors.accentColor,
	},
	discountText: {
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		color: lightTheme.colors.accentTextColor,
		fontSize: 14,
		fontWeight: 700,
	},
	cardTitle: {
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: 18,
		fontWeight: 700,
		color: lightTheme.colors.textColor,
		flexShrink: 1,
	},
	cardContent: {
		flex: 1,
		minWidth: 0,
		gap: 8,
	},
	cardSubtitle: {
		fontFamily: lightTheme.typography.fontFamily,
		fontSize: 14,
		color: lightTheme.colors.textColor,
		opacity: 0.9,
		flexShrink: 1,
	},
});
