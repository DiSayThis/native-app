import { useEffect, useMemo, useState } from 'react';

import { Pressable, StyleSheet, Text } from 'react-native';

import * as Clipboard from 'expo-clipboard';
import { Link2, TicketPercent } from 'lucide-react-native';

import { type AppTheme } from '@/shared/styles/tokens';
import Button from '@/shared/ui/Button';
import ModalSlide from '@/shared/ui/ModalSlide';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

interface IReferralInviteModalProps {
	visible: boolean;
	onClose: () => void;
	referralLink: string;
	referralPromocode: string;
}

type InviteCopyState = {
	type: 'success' | 'error';
	text: string;
} | null;

export function ReferralInviteModal({
	visible,
	onClose,
	referralLink,
	referralPromocode,
}: IReferralInviteModalProps) {
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);
	const [inviteCopyState, setInviteCopyState] = useState<InviteCopyState>(null);

	useEffect(() => {
		if (!visible) {
			setInviteCopyState(null);
		}
	}, [visible]);

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
		<ModalSlide visible={visible} onClose={onClose} contentStyle={styles.inviteModal}>
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

			<Button onPress={onClose} variant="white">
				Закрыть
			</Button>
		</ModalSlide>
	);
}

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
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
