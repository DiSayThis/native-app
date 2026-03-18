import { StyleSheet, Text, View } from 'react-native';

import type { IDiscountDTO } from '@/entities/partner/model/partner.dto';

import { formatDiscountSize, normalizeRichText } from '@/shared/lib/partner-offer-utils';
import { lightTheme } from '@/shared/styles/tokens';

type DiscountCardProps = {
	discount: IDiscountDTO;
};

export function DiscountCard({ discount }: DiscountCardProps) {
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

const styles = StyleSheet.create({
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
});
