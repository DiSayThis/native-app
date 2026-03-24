import { useMemo, useState } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import type { IDiscountDTO } from '@/entities/partner/model/partner.dto';
import { DiscountPromocodeModal } from '@/entities/partner/ui/DiscountPromocodeModal';

import { formatDiscountSize } from '@/shared/lib/partner-offer-utils';
import { type AppTheme } from '@/shared/styles/tokens';
import Button from '@/shared/ui/Button';
import MarkdownText from '@/shared/ui/MarkdownText';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

type DiscountCardProps = {
	discount: IDiscountDTO;
	studentId?: string | null;
};

export function DiscountCard({ discount, studentId }: DiscountCardProps) {
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);
	const [isPromocodeModalVisible, setIsPromocodeModalVisible] = useState(false);
	const title = discount.name?.trim() || 'Без названия';
	const sizeLabel = formatDiscountSize(discount.size);
	const canRequestPromocode = Boolean(studentId);

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
			{discount.description ? <MarkdownText content={discount.description} /> : null}
			{canRequestPromocode ? (
				<Button
					title="Получить промокод"
					variant="primary"
					onPress={() => setIsPromocodeModalVisible(true)}
				/>
			) : null}

			<DiscountPromocodeModal
				visible={isPromocodeModalVisible}
				discount={discount}
				studentId={studentId}
				onClose={() => setIsPromocodeModalVisible(false)}
			/>
		</View>
	);
}

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
		discountCard: {
			borderRadius: 14,
			padding: 14,
			backgroundColor: theme.colors.clearWhite,
			borderWidth: 1,
			borderColor: theme.colors.borderColor,
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
			fontFamily: theme.typography.fontFamilyHeadings,
			fontSize: 20,
			fontWeight: 700,
			color: theme.colors.textColor,
		},
		discountBadge: {
			paddingHorizontal: 10,
			paddingVertical: 4,
			borderRadius: 999,
			backgroundColor: theme.colors.accentColor,
		},
		discountBadgeText: {
			fontFamily: theme.typography.fontFamilyHeadings,
			fontSize: 14,
			fontWeight: 700,
			color: theme.colors.accentTextColor,
		},
	});
