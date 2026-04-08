import { useEffect, useMemo, useState } from 'react';

import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { authQueries } from '@/entities/auth/api/query';

import { type AppTheme } from '@/shared/styles/tokens';
import Button from '@/shared/ui/Button';
import { RHFPassword } from '@/shared/ui/inputs';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

const resetPasswordSchema = z
	.object({
		passwordReset: z
			.string()
			.min(1, 'Введите пароль')
			.min(8, 'Длина пароля должна составлять не менее 8 символов')
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
				'Пароль должен состоять из заглавных и строчных букв, цифр и одного специального символа',
			),
		passwordResetConfirm: z
			.string()
			.min(8, 'Подтверждение пароля должно содержать минимум 8 символов'),
	})
	.superRefine(({ passwordReset, passwordResetConfirm }, ctx) => {
		if (passwordReset !== passwordResetConfirm) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Пароли не совпадают',
				path: ['passwordResetConfirm'],
			});
		}
	});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

type ResetPasswordFormProps = {
	email: string;
	resetCode: string;
};

export function ResetPasswordForm({ email, resetCode }: ResetPasswordFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSentSuccessfully, setIsSentSuccessfully] = useState(false);
	const [generalError, setGeneralError] = useState<string | null>(null);
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);
	const { control, handleSubmit } = useForm<ResetPasswordFormValues>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			passwordReset: '',
			passwordResetConfirm: '',
		},
	});

	useEffect(() => {
		if (!isSentSuccessfully) {
			return;
		}

		const timeout = setTimeout(() => {
			router.replace('/login');
		}, 2000);

		return () => clearTimeout(timeout);
	}, [isSentSuccessfully]);

	const onSubmit = async ({ passwordReset }: ResetPasswordFormValues) => {
		if (!email || !resetCode) {
			setGeneralError('Ссылка для сброса пароля недействительна');
			return;
		}

		try {
			setGeneralError(null);
			setIsSubmitting(true);
			await authQueries.resetPassword({
				email,
				resetCode,
				newPassword: passwordReset,
			});
			setIsSentSuccessfully(true);
		} catch {
			setGeneralError('Ошибка при сбросе пароля');
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isSentSuccessfully) {
		return (
			<View style={styles.card}>
				<Text style={styles.title}>Пароль изменен</Text>
				<Text style={styles.description}>
					Ваш новый пароль успешно сохранен. Теперь вы можете войти в личный кабинет.
				</Text>
				<Button onPress={() => router.replace('/login')}>Перейти ко входу</Button>
			</View>
		);
	}

	return (
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
			<View style={styles.card}>
				<Text style={styles.title}>Сброс пароля</Text>
				<Text style={styles.description}>
					Введите новый пароль для аккаунта {email || 'по ссылке восстановления'}.
				</Text>
				<View style={styles.inputs}>
					<RHFPassword
						control={control}
						name="passwordReset"
						label="Введите новый пароль"
						placeholder="********"
						showClearButton
					/>
					<RHFPassword
						control={control}
						name="passwordResetConfirm"
						label="Подтвердите новый пароль"
						placeholder="********"
						showClearButton
					/>
				</View>
				{generalError ? <Text style={styles.errorText}>{generalError}</Text> : null}
				<View style={styles.buttons}>
					<Button disabled={isSubmitting} onPress={handleSubmit(onSubmit)}>
						{isSubmitting ? 'Отправка...' : 'Отправить'}
					</Button>
					<Button
						disabled={isSubmitting}
						onPress={() => router.replace('/login')}
						variant="secondary"
					>
						Вернуться ко входу
					</Button>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
}

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
		card: {
			width: '100%',
			maxWidth: 420,
			alignSelf: 'center',
			marginTop: 24,
			padding: 20,
			borderRadius: 24,
			gap: 14,
			backgroundColor: theme.colors.bgWhite,
		},
		title: {
			fontSize: theme.typography.fontSizeHeading,
			letterSpacing: theme.typography.headingsLetterSpacing,
			color: theme.colors.textColor,
			fontFamily: theme.typography.fontFamilyHeadings,
			textAlign: 'center',
		},
		description: {
			fontSize: 14,
			lineHeight: 20,
			color: theme.colors.labelColor,
			fontFamily: theme.typography.fontFamily,
			textAlign: 'center',
		},
		inputs: {
			gap: 8,
		},
		buttons: {
			gap: 10,
		},
		errorText: {
			fontSize: 14,
			color: theme.colors.error,
			fontFamily: theme.typography.fontFamily,
		},
	});
