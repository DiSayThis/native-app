import { useState } from 'react';

import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { authQueries } from '@/entities/auth/api/query';

import { lightTheme } from '@/shared/styles/tokens';
import { RHFInput } from '@/shared/ui/inputs';

interface IForgotPasswordModalProps {
	visible: boolean;
	onClose: () => void;
}

interface IForgotPasswordValues {
	email: string;
}

const forgotPasswordSchema = z.object({
	email: z.string().email('Некорректный email'),
});

export function ForgotPasswordModal({ visible, onClose }: IForgotPasswordModalProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [isSentSuccessfully, setIsSentSuccessfully] = useState(false);
	const [requestError, setRequestError] = useState<string | null>(null);
	const { control, handleSubmit, reset } = useForm<IForgotPasswordValues>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: '',
		},
	});

	const resetState = () => {
		setIsLoading(false);
		setIsSentSuccessfully(false);
		setRequestError(null);
		reset();
	};

	const handleClose = () => {
		resetState();
		onClose();
	};

	const onSubmit = async ({ email }: IForgotPasswordValues) => {
		setRequestError(null);
		setIsLoading(true);
		try {
			await authQueries.forgotPassword(email);
			setIsSentSuccessfully(true);
		} catch {
			setRequestError('Ошибка соединения');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal animationType="fade" transparent visible={visible} onRequestClose={handleClose}>
			<View style={styles.backdrop}>
				<Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
				<View style={styles.card}>
					{isSentSuccessfully ? (
						<>
							<Text style={styles.title}>Письмо отправлено</Text>
							<Text style={styles.description}>
								Письмо для сброса пароля будет отправлено на указанную почту.
							</Text>
							<Pressable onPress={handleClose} style={styles.primaryButton}>
								<Text style={styles.primaryButtonText}>Закрыть</Text>
							</Pressable>
						</>
					) : (
						<>
							<Text style={styles.title}>Сброс пароля</Text>
							<RHFInput
								control={control}
								name="email"
								label="Почта от личного кабинета"
								type="email"
								placeholder="Введите почту"
								autoCapitalize="none"
							/>
							{requestError ? <Text style={styles.errorText}>{requestError}</Text> : null}
							<Pressable
								disabled={isLoading}
								onPress={handleSubmit(onSubmit)}
								style={styles.primaryButton}
							>
								{isLoading ? (
									<ActivityIndicator color={lightTheme.colors.accentTextColor} />
								) : (
									<Text style={styles.primaryButtonText}>Отправить</Text>
								)}
							</Pressable>
						</>
					)}
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	backdrop: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 24,
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
	},
	card: {
		width: '100%',
		maxWidth: 420,
		backgroundColor: lightTheme.colors.bgWhite,
		borderRadius: 20,
		padding: 20,
		gap: 12,
	},
	title: {
		fontSize: 24,
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		color: lightTheme.colors.textColor,
	},
	description: {
		fontSize: 16,
		fontFamily: lightTheme.typography.fontFamily,
		color: lightTheme.colors.textColor,
		lineHeight: 22,
	},
	errorText: {
		fontSize: 14,
		color: lightTheme.colors.error,
		fontFamily: lightTheme.typography.fontFamily,
	},
	primaryButton: {
		height: 48,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: lightTheme.colors.accentColor,
	},
	primaryButtonText: {
		fontSize: 16,
		textTransform: 'uppercase',
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		color: lightTheme.colors.accentTextColor,
	},
});
