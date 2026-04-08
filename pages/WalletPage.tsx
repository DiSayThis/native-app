import { useMemo, useState } from 'react';

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';
import { Gift, Landmark, TriangleAlert, UserPlus, Wallet } from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { useReferralRewardRequestFlow } from '@/features/referral-program/hook/useReferralRewardRequestFlow';
import {
	MIN_REFERRAL_REWARD_BALANCE,
	REFERRAL_REWARD_RESPONSE_HOURS,
} from '@/features/referral-program/model/referral-program.constants';
import { ReferralInviteModal } from '@/features/referral-program/ui/ReferralInviteModal';

import { authAtom } from '@/entities/auth/model/auth.store';
import { useUserProfile } from '@/entities/user/hook/useUserProfile';
import { isPaymentInformationComplete } from '@/entities/user/lib/isPaymentInformationComplete';

import { API_BASE_URL } from '@/shared/api/urls';
import { type AppTheme } from '@/shared/styles/tokens';
import Button from '@/shared/ui/Button';
import ModalSlide from '@/shared/ui/ModalSlide';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

const FIXED_TITLE_HEIGHT = 56;
const FIXED_TITLE_GRADIENT_HEIGHT = 96;
const HERO_ICON_SIZE = 124;

export default function WalletPage() {
	const router = useRouter();
	const [isInviteMenuVisible, setIsInviteMenuVisible] = useState(false);
	const { id: studentId } = useAtomValue(authAtom);
	const { theme } = useTheme();
	const { profile } = useUserProfile(studentId);
	const styles = useMemo(() => createStyles(theme), [theme]);
	const balance = profile?.balance ?? 0;
	const isPaymentInfoReady = isPaymentInformationComplete(profile?.paymentInformation);
	const showPaymentWarning = Boolean(profile) && !isPaymentInfoReady;
	const referralPromocode = profile?.promocode?.trim() ?? '';
	const referralLink = referralPromocode
		? `https://${API_BASE_URL}/registration?promocode=${encodeURIComponent(referralPromocode)}`
		: '';
	const referralRewardFlow = useReferralRewardRequestFlow({
		studentId,
		balance,
		isPaymentInformationComplete: isPaymentInfoReady,
	});

	return (
		<View style={styles.container}>
			<View pointerEvents="none" style={styles.fixedTitleContainer}>
				<Svg
					style={styles.fixedTitleGradient}
					width="100%"
					height="100%"
					preserveAspectRatio="none"
				>
					<Defs>
						<LinearGradient id="walletTitleGradient" x1="0" y1="0" x2="0" y2="1">
							<Stop offset="0" stopColor={theme.colors.background} stopOpacity="1" />
							<Stop offset="0.4" stopColor={theme.colors.background} stopOpacity="1" />
							<Stop offset="1" stopColor={theme.colors.background} stopOpacity="0" />
						</LinearGradient>
					</Defs>
					<Rect x="0" y="0" width="100%" height="100%" fill="url(#walletTitleGradient)" />
				</Svg>
				<View style={styles.fixedTitleContent}>
					<Text style={styles.title}>Кошелек</Text>
				</View>
			</View>

			<ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
				<View style={styles.hero}>
					<Wallet size={HERO_ICON_SIZE} color={theme.colors.accentColor} />
					<View style={styles.balanceBlock}>
						<Text style={styles.balanceLabel}>Ваш баланс</Text>
						<Text style={styles.balanceValue}>{`${balance} ₽`}</Text>
						{showPaymentWarning ? (
							<View style={styles.warningCard}>
								<TriangleAlert size={18} color={theme.colors.warning} />
								<Text style={styles.warningText}>
									Реквизиты не заполнены. Пожалуйста, добавьте банковские реквизиты.
								</Text>
							</View>
						) : null}
					</View>
				</View>

				<View style={styles.actionsRow}>
					<Pressable
						style={[styles.actionButton, styles.rowButton]}
						onPress={() => router.push('/student-credentials')}
					>
						<Landmark size={24} color={theme.colors.accentColor} />
						<Text style={styles.actionText}>Банковские реквизиты</Text>
					</Pressable>

					<Pressable
						style={[styles.actionButton, styles.rowButton]}
						onPress={() => setIsInviteMenuVisible(true)}
					>
						<UserPlus size={24} color={theme.colors.accentColor} />
						<Text style={styles.actionText}>Пригласить друзей</Text>
					</Pressable>
				</View>

				<Pressable
					style={[
						styles.actionButton,
						referralRewardFlow.isSubmitting ? styles.actionButtonDisabled : null,
					]}
					onPress={() => void referralRewardFlow.handleRewardPress()}
					disabled={referralRewardFlow.isSubmitting}
				>
					<Gift size={24} color={theme.colors.accentColor} />
					<Text style={styles.actionText}>
						{referralRewardFlow.isSubmitting ? 'Отправляем заявку...' : 'Получить вознаграждение'}
					</Text>
				</Pressable>

				{referralRewardFlow.rewardErrorText ? <Text style={styles.errorText}>{referralRewardFlow.rewardErrorText}</Text> : null}
			</ScrollView>

			<ReferralInviteModal
				visible={isInviteMenuVisible}
				onClose={() => setIsInviteMenuVisible(false)}
				referralLink={referralLink}
				referralPromocode={referralPromocode}
			/>

			<ModalSlide
				visible={referralRewardFlow.isPaymentInfoVisible}
				onClose={referralRewardFlow.closePaymentInfoModal}
				contentStyle={styles.statusModal}
			>
				<Text style={styles.statusModalTitle}>Заполните реквизиты</Text>
				<Text style={styles.statusModalDescription}>
					Чтобы получить вознаграждение, добавьте банковские реквизиты в профиле.
				</Text>
				<View style={styles.statusModalActions}>
					<Button
						onPress={() => {
							referralRewardFlow.closePaymentInfoModal();
							router.push('/student-credentials');
						}}
					>
						Перейти к реквизитам
					</Button>
					<Button onPress={referralRewardFlow.closePaymentInfoModal} variant="white">
						Позже
					</Button>
				</View>
			</ModalSlide>

			<ModalSlide
				visible={referralRewardFlow.isSuccessVisible}
				onClose={referralRewardFlow.closeSuccessModal}
				contentStyle={styles.statusModal}
			>
				<Text style={styles.statusModalTitle}>Заявка на выплату отправлена</Text>
				<Text style={styles.statusModalDescription}>
					Мы свяжемся с вами в течение {REFERRAL_REWARD_RESPONSE_HOURS} часов.
				</Text>
				<Button onPress={referralRewardFlow.closeSuccessModal} variant="white">
					Закрыть
				</Button>
			</ModalSlide>

			<ModalSlide
				visible={referralRewardFlow.isLowBalanceVisible}
				onClose={referralRewardFlow.closeLowBalanceModal}
				contentStyle={styles.statusModal}
			>
				<Text style={styles.statusModalTitle}>Недостаточно средств</Text>
				<Text style={styles.statusModalDescription}>
					Для получения вознаграждения минимальный баланс должен составлять {MIN_REFERRAL_REWARD_BALANCE} ₽.
				</Text>
				<Button onPress={referralRewardFlow.closeLowBalanceModal} variant="white">
					Понятно
				</Button>
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
		fixedTitleContainer: {
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			height: FIXED_TITLE_GRADIENT_HEIGHT,
			zIndex: 10,
		},
		fixedTitleGradient: {
			...StyleSheet.absoluteFillObject,
		},
		fixedTitleContent: {
			height: FIXED_TITLE_HEIGHT,
			paddingHorizontal: theme.spacing.x4,
			justifyContent: 'center',
		},
		title: {
			fontFamily: theme.typography.fontFamilyHeadings,
			fontSize: theme.typography.fontSizeHeading,
			color: theme.colors.textColor,
			textAlign: 'center',
		},
		scroll: {
			flex: 1,
		},
		content: {
			paddingTop: FIXED_TITLE_HEIGHT + theme.spacing.x6,
			paddingHorizontal: theme.spacing.x4,
			paddingBottom: 120,
			gap: theme.spacing.x4,
		},
		hero: {
			alignItems: 'center',
			justifyContent: 'center',
			paddingTop: theme.spacing.x5,
			gap: theme.spacing.x3,
		},
		balanceBlock: {
			alignItems: 'center',
			gap: 2,
			width: '100%',
		},
		balanceLabel: {
			fontFamily: theme.typography.fontFamily,
			fontSize: theme.typography.fontSizeBase,
			color: theme.colors.labelColor,
		},
		balanceValue: {
			fontFamily: theme.typography.fontFamilyHeadings,
			fontSize: 32,
			color: theme.colors.textColor,
		},
		warningCard: {
			marginTop: theme.spacing.x3,
			width: '100%',
			borderRadius: 12,
			borderWidth: 1,
			borderColor: theme.colors.warning,
			backgroundColor: theme.colors.clearWhite,
			paddingHorizontal: theme.spacing.x3,
			paddingVertical: theme.spacing.x3,
			flexDirection: 'row',
			alignItems: 'center',
			gap: 8,
		},
		warningText: {
			flex: 1,
			fontFamily: theme.typography.fontFamily,
			fontSize: 14,
			color: theme.colors.warning,
		},
		actionsRow: {
			flexDirection: 'row',
			gap: theme.spacing.x3,
		},
		actionButton: {
			minHeight: 84,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			gap: 8,
			paddingHorizontal: theme.spacing.x3,
			borderRadius: 14,
			borderWidth: 1,
			borderColor: theme.colors.borderColor,
			backgroundColor: theme.colors.clearWhite,
		},
		actionButtonDisabled: {
			opacity: 0.7,
		},
		rowButton: {
			flex: 1,
		},
		actionText: {
			flexShrink: 1,
			textAlign: 'center',
			fontFamily: theme.typography.fontFamilyHeadings,
			fontSize: theme.typography.fontSizeButtons,
			color: theme.colors.textColor,
		},
		errorText: {
			fontFamily: theme.typography.fontFamily,
			fontSize: 14,
			color: theme.colors.warning,
		},
		statusModal: {
			gap: theme.spacing.x3,
		},
		statusModalTitle: {
			fontFamily: theme.typography.fontFamilyHeadings,
			fontSize: 22,
			color: theme.colors.textColor,
		},
		statusModalDescription: {
			fontFamily: theme.typography.fontFamily,
			fontSize: 14,
			color: theme.colors.labelColor,
		},
		statusModalActions: {
			gap: theme.spacing.x2,
		},
	});
