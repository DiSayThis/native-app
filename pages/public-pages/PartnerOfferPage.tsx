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
import { ArrowLeft } from 'lucide-react-native';

import { usePartnerOfferData } from '@/features/partner-offer/hook/usePartnerOfferData';

import { authAtom } from '@/entities/auth/model/auth.store';
import { DiscountCard } from '@/entities/partner/ui/DiscountCard';

import { FILE_API } from '@/shared/api/urls';
import { normalizeRichText, normalizeSiteUrl } from '@/shared/lib/partner-offer-utils';
import { lightTheme } from '@/shared/styles/tokens';
import Button from '@/shared/ui/Button';
import ModalSlide from '@/shared/ui/ModalSlide';

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
	const [isDescriptionModalVisible, setIsDescriptionModalVisible] = useState(false);
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

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.content}>
			<Pressable style={styles.backButton} onPress={() => router.back()}>
				<ArrowLeft size={18} color={lightTheme.colors.textColor} />
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
					<Button
						title="Открыть описание"
						variant="secondary"
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
					discounts.map((discount) => <DiscountCard key={discount.id} discount={discount} />)
				) : (
					<View style={styles.emptyCard}>
						<Text style={styles.emptyText}>У данного партнера нет предложений</Text>
					</View>
				)}
			</View>

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
					<Text style={styles.partnerDescription}>{cleanDescription}</Text>
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
		</ScrollView>
	);
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
