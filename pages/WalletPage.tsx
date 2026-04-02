import { useEffect, useMemo, useState } from 'react';

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';
import { Gift, Landmark, Link2, TicketPercent, TriangleAlert, UserPlus, Wallet } from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { authAtom } from '@/entities/auth/model/auth.store';
import { useUserProfile } from '@/entities/user/hook/useUserProfile';

import { API_BASE_URL } from '@/shared/api/urls';
import { type AppTheme } from '@/shared/styles/tokens';
import Button from '@/shared/ui/Button';
import ModalSlide from '@/shared/ui/ModalSlide';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

const FIXED_TITLE_HEIGHT = 56;
const FIXED_TITLE_GRADIENT_HEIGHT = 96;
const HERO_ICON_SIZE = 124;

const noop = () => undefined;

export default function WalletPage() {
	const router = useRouter();
	const [isInviteMenuVisible, setIsInviteMenuVisible] = useState(false);
	const [inviteCopyState, setInviteCopyState] = useState<{
		type: 'success' | 'error';
		text: string;
	} | null>(null);
	const { id: studentId } = useAtomValue(authAtom);
	const { theme } = useTheme();
	const { profile } = useUserProfile(studentId);
	const styles = useMemo(() => createStyles(theme), [theme]);
	const balance = profile?.balance ?? 0;
	const paymentInformation = profile?.paymentInformation;
	const isPaymentInformationComplete = Boolean(
		paymentInformation &&
		Number.isFinite(paymentInformation.inn) &&
		paymentInformation.inn > 0 &&
		paymentInformation.bik?.trim() &&
		paymentInformation.accountNumber?.trim() &&
		paymentInformation.patronymic?.trim(),
	);
	const showPaymentWarning = Boolean(profile) && !isPaymentInformationComplete;
	const referralPromocode = profile?.promocode?.trim() ?? '';
	const referralLink = referralPromocode
		? `https://${API_BASE_URL}/registration?promocode=${encodeURIComponent(referralPromocode)}`
		: '';

	useEffect(() => {
		if (!inviteCopyState) {
			return;
		}

		const timer = setTimeout(() => {
			setInviteCopyState(null);
		}, 2200);

		return () => clearTimeout(timer);
	}, [inviteCopyState]);

	const copyValue = async (value: string, successText: string, emptyText: string) => {
		if (!value) {
			setInviteCopyState({
				type: 'error',
				text: emptyText,
			});
			return;
		}

		try {
			await Clipboard.setStringAsync(value);
			setInviteCopyState({
				type: 'success',
				text: successText,
			});
		} catch {
			setInviteCopyState({
				type: 'error',
				text: 'Не удалось скопировать данные',
			});
		}
	};

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
									Реквизиты не заполнены. Пожалуйста добавьте банковские реквизиты
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
						onPress={() => {
							setInviteCopyState(null);
							setIsInviteMenuVisible(true);
						}}
					>
						<UserPlus size={24} color={theme.colors.accentColor} />
						<Text style={styles.actionText}>Пригласить друзей</Text>
					</Pressable>
				</View>

				<Pressable style={styles.actionButton} onPress={noop}>
					<Gift size={24} color={theme.colors.accentColor} />
					<Text style={styles.actionText}>Получить вознограждение</Text>
				</Pressable>
			</ScrollView>

			<ModalSlide
				visible={isInviteMenuVisible}
				onClose={() => setIsInviteMenuVisible(false)}
				contentStyle={styles.inviteModal}
			>
				<Text style={styles.inviteTitle}>Пригласить друзей</Text>
				<Text style={styles.inviteSubtitle}>Выберите, что хотите скопировать</Text>

				<Pressable
					style={styles.inviteOption}
					onPress={() =>
						void copyValue(
							referralLink,
							'Ссылка-приглашение скопирована',
							'Ссылка-приглашение пока недоступна',
						)
					}
				>
					<Link2 size={20} color={theme.colors.accentColor} />
					<Text style={styles.inviteOptionText}>Скопировать ссылку-приглашение</Text>
				</Pressable>

				<Pressable
					style={styles.inviteOption}
					onPress={() =>
						void copyValue(referralPromocode, 'Промокод скопирован', 'Промокод пока недоступен')
					}
				>
					<TicketPercent size={20} color={theme.colors.accentColor} />
					<Text style={styles.inviteOptionText}>Скопировать промокод</Text>
				</Pressable>

				{inviteCopyState ? (
					<Text
						style={[
							styles.inviteStatus,
							inviteCopyState.type === 'success' ? styles.inviteSuccess : styles.inviteError,
						]}
					>
						{inviteCopyState.text}
					</Text>
				) : null}

				<Button onPress={() => setIsInviteMenuVisible(false)} variant="white">
					Закрыть
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
		inviteModal: {
			gap: theme.spacing.x3,
		},
		inviteTitle: {
			fontFamily: theme.typography.fontFamilyHeadings,
			fontSize: 22,
			color: theme.colors.textColor,
		},
		inviteSubtitle: {
			fontFamily: theme.typography.fontFamily,
			fontSize: 14,
			color: theme.colors.labelColor,
		},
		inviteOption: {
			minHeight: 56,
			borderRadius: 12,
			borderWidth: 1,
			borderColor: theme.colors.borderColor,
			backgroundColor: theme.colors.clearWhite,
			paddingHorizontal: theme.spacing.x3,
			flexDirection: 'row',
			alignItems: 'center',
			gap: 10,
		},
		inviteOptionText: {
			flex: 1,
			fontFamily: theme.typography.fontFamily,
			fontSize: 15,
			color: theme.colors.textColor,
		},
		inviteStatus: {
			fontFamily: theme.typography.fontFamily,
			fontSize: 14,
		},
		inviteSuccess: {
			color: theme.colors.success,
		},
		inviteError: {
			color: theme.colors.warning,
		},
	});
