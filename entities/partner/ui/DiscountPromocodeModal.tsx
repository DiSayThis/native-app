import { useEffect, useMemo, useState } from 'react';

import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import * as Clipboard from 'expo-clipboard';
import { Copy } from 'lucide-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useDiscountPromocode } from '@/entities/partner/hook/useDiscountPromocode';
import type { IDiscountDTO } from '@/entities/partner/model/partner.dto';

import { type AppTheme } from '@/shared/styles/tokens';
import Button from '@/shared/ui/Button';
import MarkdownText from '@/shared/ui/MarkdownText';
import ModalSlide from '@/shared/ui/ModalSlide';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

type DiscountPromocodeModalProps = {
	visible: boolean;
	discount: IDiscountDTO;
	studentId?: string | null;
	onClose: () => void;
};

export function DiscountPromocodeModal({
	visible,
	discount,
	studentId,
	onClose,
}: DiscountPromocodeModalProps) {
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);
	const [isPromocodeCopied, setIsPromocodeCopied] = useState(false);
	const copiedOpacity = useSharedValue(0);
	const copiedTranslateY = useSharedValue(6);
	const { promocode, isLoading: isPromocodeLoading } = useDiscountPromocode(
		discount.id,
		studentId,
		visible,
	);

	useEffect(() => {
		if (!visible) {
			setIsPromocodeCopied(false);
		}
	}, [visible]);

	useEffect(() => {
		if (!isPromocodeCopied) {
			return;
		}

		const timeout = setTimeout(() => {
			setIsPromocodeCopied(false);
		}, 2000);

		return () => clearTimeout(timeout);
	}, [isPromocodeCopied]);

	useEffect(() => {
		if (isPromocodeCopied) {
			copiedOpacity.value = withTiming(1, { duration: 180 });
			copiedTranslateY.value = withTiming(0, { duration: 180 });
			return;
		}

		copiedOpacity.value = withTiming(0, { duration: 140 });
		copiedTranslateY.value = withTiming(6, { duration: 140 });
	}, [copiedOpacity, copiedTranslateY, isPromocodeCopied]);

	const copiedAnimatedStyle = useAnimatedStyle(() => ({
		opacity: copiedOpacity.value,
		transform: [{ translateY: copiedTranslateY.value }],
	}));

	const handleCopyPromocode = async () => {
		if (!promocode) {
			return;
		}

		try {
			await Clipboard.setStringAsync(promocode);
			setIsPromocodeCopied(true);
		} catch {
			setIsPromocodeCopied(false);
		}
	};

	return (
		<ModalSlide visible={visible} onClose={onClose} contentStyle={styles.modalCard}>
			<Text style={styles.modalTitle}>{discount.name?.trim() || 'Промокод'}</Text>

			{discount.description ? (
				<ScrollView
					style={styles.modalDescriptionScroll}
					contentContainerStyle={styles.modalDescriptionContent}
					showsVerticalScrollIndicator={false}
				>
					<MarkdownText content={discount.description} />
				</ScrollView>
			) : null}

			<Pressable
				style={[styles.promocodeCard, isPromocodeCopied ? styles.copiedPromocodeValue : null]}
				onPress={() => void handleCopyPromocode()}
				disabled={isPromocodeLoading || !promocode}
			>
				<View style={styles.promocodeTextBlock}>
					<Text style={styles.promocodeLabel}>Промокод</Text>
					{isPromocodeLoading ? (
						<ActivityIndicator color={theme.colors.accentColor} />
					) : (
						<Text style={styles.promocodeValue}>{promocode || 'Не удалось получить промокод'}</Text>
					)}
				</View>

				<View
					style={[
						styles.promocodeCopyIcon,
						!promocode || isPromocodeLoading ? styles.promocodeCopyIconDisabled : null,
					]}
				>
					<Copy size={18} color={theme.colors.textColor} />
				</View>
			</Pressable>

			<Animated.Text style={[styles.promocodeCopiedText, copiedAnimatedStyle]}>
				Промокод скопирован
			</Animated.Text>

			<Button title="Закрыть" variant="white" onPress={onClose} />
		</ModalSlide>
	);
}

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
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
		promocodeCard: {
			borderWidth: 1,
			borderColor: theme.colors.borderColor,
			backgroundColor: theme.colors.clearWhite,
			borderRadius: 14,
			padding: 12,
			flexDirection: 'row',
			alignItems: 'center',
			gap: 10,
		},
		promocodeTextBlock: {
			flex: 1,
			gap: 6,
		},
		promocodeLabel: {
			fontFamily: theme.typography.fontFamily,
			fontSize: 13,
			color: theme.colors.labelColor,
		},
		promocodeValue: {
			fontFamily: theme.typography.fontFamilyHeadings,
			fontSize: 18,
			fontWeight: 700,
			color: theme.colors.textColor,
		},
		copiedPromocodeValue: {
			borderColor: theme.colors.success,
		},
		promocodeCopyIcon: {
			width: 36,
			height: 36,
			borderRadius: 10,
			borderWidth: 1,
			borderColor: theme.colors.borderColor,
			backgroundColor: theme.colors.bgSecondary,
			alignItems: 'center',
			justifyContent: 'center',
		},
		promocodeCopyIconDisabled: {
			opacity: 0.4,
		},
		promocodeCopiedText: {
			fontFamily: theme.typography.fontFamily,
			fontSize: 14,
			color: theme.colors.success,
		},
	});
