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
import { ArrowLeft, ExternalLink } from 'lucide-react-native';

import { usePartnerOfferData } from '@/features/partner-offer/hook/usePartnerOfferData';

import { authAtom } from '@/entities/auth/model/auth.store';
import type { IDiscountDTO } from '@/entities/partner/model/partner.dto';

import { FILE_API } from '@/shared/api/urls';
import { lightTheme } from '@/shared/styles/tokens';

const PARTNER_IMAGE_PLACEHOLDER = require('../../shared/assets/placeholder.jpg');

type PartnerOfferPageProps = {
	partnerId?: string;
};

export default function PartnerOfferPage({ partnerId }: PartnerOfferPageProps) {
	const { id: studentId } = useAtomValue(authAtom);
	const { partner, discounts, isLoading, isError, refetch } = usePartnerOfferData(
		partnerId,
		studentId,
	);
	const [isImageLoading, setIsImageLoading] = useState(true);
	const [hasImageError, setHasImageError] = useState(false);
	const [isOpeningSite, setIsOpeningSite] = useState(false);
	const hasValidId = Boolean(partnerId?.trim());

	const cleanSubtitle = useMemo(() => normalizeRichText(partner?.subtitle), [partner?.subtitle]);
	const cleanDescription = useMemo(
		() => normalizeRichText(partner?.description),
		[partner?.description],
	);

	if (!hasValidId) {
		return (
			<View style={styles.centerState}>
				<Text style={styles.errorText}>Не удалось определить предложение партнера</Text>
				<Pressable style={styles.actionButton} onPress={() => router.back()}>
					<Text style={styles.actionButtonText}>Назад</Text>
				</Pressable>
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
				<Pressable style={styles.actionButton} onPress={() => void refetch()}>
					<Text style={styles.actionButtonText}>Повторить</Text>
				</Pressable>
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

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.content}>
			<Pressable style={styles.backButton} onPress={() => router.back()}>
				<ArrowLeft size={18} color={lightTheme.colors.textColor} />
				<Text style={styles.backText}>Назад</Text>
			</Pressable>

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

				<Text style={styles.partnerTitle}>{partner.companyName}</Text>
				{cleanSubtitle ? <Text style={styles.partnerSubtitle}>{cleanSubtitle}</Text> : null}
				{cleanDescription ? (
					<Text style={styles.partnerDescription}>{cleanDescription}</Text>
				) : null}

				{canOpenSite ? (
					<Pressable
						style={[styles.siteButton, isOpeningSite ? styles.siteButtonDisabled : null]}
						onPress={() => void handleOpenSite()}
						disabled={isOpeningSite}
					>
						<Text style={styles.siteButtonText}>Перейти на сайт</Text>
						<ExternalLink size={16} color={lightTheme.colors.accentTextColor} />
					</Pressable>
				) : null}
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Предложения</Text>
				{discounts.length > 0 ? (
					discounts.map((discount) => <DiscountCard key={discount.id} discount={discount} />)
				) : (
					<View style={styles.emptyCard}>
						<Text style={styles.emptyText}>У данного партнера нет предложений</Text>
					</View>
				)}
			</View>
		</ScrollView>
	);
}

type DiscountCardProps = {
	discount: IDiscountDTO;
};

function DiscountCard({ discount }: DiscountCardProps) {
	const title = discount.name?.trim() || 'Без названия';
	const description = normalizeRichText(discount.description);
	const sizeLabel = formatDiscountSize(discount.size);

	return (
		<View style={styles.discountCard}>
			<View style={styles.discountHeader}>
				<Text style={styles.discountTitle}>{title}</Text>
				{sizeLabel ? (
					<View style={styles.discountBadge}>
						<Text style={styles.discountBadgeText}>{sizeLabel}</Text>
					</View>
				) : null}
			</View>
			{description ? <Text style={styles.discountDescription}>{description}</Text> : null}
		</View>
	);
}

function normalizeRichText(value?: string) {
	if (!value) {
		return '';
	}

	return value
		.replace(/!\[.*?\]\(.*?\)/g, '')
		.replace(/\[(.*?)\]\(.*?\)/g, '$1')
		.replace(/<[^>]+>/g, ' ')
		.replace(/[#*_`>|-]/g, ' ')
		.replace(/\r?\n+/g, ' ')
		.replace(/\s{2,}/g, ' ')
		.trim();
}

function formatDiscountSize(size?: number) {
	if (typeof size !== 'number' || Number.isNaN(size)) {
		return null;
	}

	if (Number.isInteger(size)) {
		return `${size}%`;
	}

	return `${size.toString().replace('.', ',')}%`;
}

function normalizeSiteUrl(site?: string) {
	if (!site) {
		return null;
	}

	if (site.startsWith('http://') || site.startsWith('https://')) {
		return site;
	}

	return `https://${site}`;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
	content: {
		paddingHorizontal: lightTheme.spacing.x4,
		paddingTop: lightTheme.spacing.x4,
		paddingBottom: 120,
		gap: 16,
	},
	centerState: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: lightTheme.spacing.x4,
		backgroundColor: lightTheme.colors.background,
	},
	backButton: {
		alignSelf: 'flex-start',
		height: 36,
		paddingHorizontal: 10,
		borderRadius: 10,
		backgroundColor: lightTheme.colors.clearWhite,
		borderWidth: 1,
		borderColor: lightTheme.colors.borderColor,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	backText: {
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: 14,
		fontWeight: 700,
		color: lightTheme.colors.textColor,
	},
	partnerCard: {
		borderRadius: 16,
		padding: 16,
		backgroundColor: lightTheme.colors.clearWhite,
		borderWidth: 1,
		borderColor: lightTheme.colors.borderColor,
		gap: 10,
	},
	imageContainer: {
		position: 'relative',
		width: '100%',
		height: 180,
		borderRadius: 14,
		overflow: 'hidden',
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
	partnerTitle: {
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: 24,
		fontWeight: 700,
		color: lightTheme.colors.textColor,
	},
	partnerSubtitle: {
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: 16,
		color: lightTheme.colors.textColor,
		opacity: 0.9,
	},
	partnerDescription: {
		fontFamily: lightTheme.typography.fontFamily,
		fontSize: 15,
		lineHeight: 22,
		color: lightTheme.colors.textColor,
		opacity: 0.95,
	},
	siteButton: {
		height: 44,
		paddingHorizontal: 14,
		borderRadius: 10,
		backgroundColor: lightTheme.colors.accentColor,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
	},
	siteButtonDisabled: {
		opacity: 0.6,
	},
	siteButtonText: {
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: 15,
		fontWeight: 700,
		color: lightTheme.colors.accentTextColor,
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
	discountCard: {
		borderRadius: 14,
		padding: 14,
		backgroundColor: lightTheme.colors.clearWhite,
		borderWidth: 1,
		borderColor: lightTheme.colors.borderColor,
		gap: 10,
	},
	discountHeader: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		gap: 8,
	},
	discountTitle: {
		flex: 1,
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: 18,
		fontWeight: 700,
		color: lightTheme.colors.textColor,
	},
	discountDescription: {
		fontFamily: lightTheme.typography.fontFamily,
		fontSize: 15,
		lineHeight: 22,
		color: lightTheme.colors.textColor,
		opacity: 0.92,
	},
	discountBadge: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 999,
		backgroundColor: lightTheme.colors.accentColor,
	},
	discountBadgeText: {
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: 14,
		fontWeight: 700,
		color: lightTheme.colors.accentTextColor,
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
	actionButton: {
		height: 42,
		paddingHorizontal: 16,
		borderRadius: 10,
		backgroundColor: lightTheme.colors.accentColor,
		alignItems: 'center',
		justifyContent: 'center',
	},
	actionButtonText: {
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: 14,
		fontWeight: 700,
		color: lightTheme.colors.accentTextColor,
	},
});
