import { useState } from 'react';

import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { loginAtom } from '@/entities/auth/model/auth.store';

import { lightTheme } from '@/shared/styles/tokens';
import Button from '@/shared/ui/Button';
import { RHFInput, RHFPassword } from '@/shared/ui/inputs';

import { ForgotPasswordModal } from './ForgotPasswordModal';

const loginFormSchema = z.object({
	email: z.email('Некорректный email'),
	password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
	const [auth, login] = useAtom(loginAtom);
	const [isPasswordResetVisible, setIsPasswordResetVisible] = useState(false);
	const [generalError, setGeneralError] = useState<string | null>(null);
	const { control, handleSubmit } = useForm<LoginFormValues>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});
	const handleRegistration = () => {
		router.push('/registration');
	};
	const onSubmit = async (formData: LoginFormValues) => {
		setGeneralError(null);
		const result = await login({
			email: formData.email.trim(),
			password: formData.password,
		});

		if (!result.success) {
			setGeneralError(result.error || 'Ошибка авторизации');
			return;
		}

		router.replace('/');
	};

	return (
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
			<View style={styles.form}>
				<Text style={styles.formTitle}>Вход в студмарт</Text>
				<View style={styles.inputs}>
					<RHFInput
						control={control}
						name="email"
						label="Почта"
						type="email"
						placeholder="Введите email"
						autoCapitalize="none"
						showClearButton
					/>
					<RHFPassword
						control={control}
						name="password"
						label="Пароль"
						placeholder="Введите пароль"
						showClearButton
					/>
				</View>
				{generalError ? <Text style={styles.errorText}>{generalError}</Text> : null}

				<Button disabled={auth.isLoading} onPress={handleSubmit(onSubmit)}>
					{auth.isLoading ? 'Вход...' : 'Войти'}
				</Button>
				<Button disabled={auth.isLoading} onPress={handleRegistration} variant="secondary">
					{'Регистрация'}
				</Button>
			</View>

			<ForgotPasswordModal
				visible={isPasswordResetVisible}
				onClose={() => setIsPasswordResetVisible(false)}
			/>
			<Pressable onPress={() => setIsPasswordResetVisible(true)}>
				<Text style={styles.forgotPassword}>Не помню пароль</Text>
			</Pressable>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	inputs: {
		gap: 8,
		marginBottom: 12,
	},
	form: {
		width: '100%',
		maxWidth: 420,
		alignSelf: 'center',
		marginTop: 24,
		padding: 20,
		borderRadius: 24,
		// borderWidth: 1,
		// borderColor: lightTheme.colors.borderColor,
		gap: 14,
		backgroundColor: lightTheme.colors.bgWhite,
	},
	formTitle: {
		fontSize: lightTheme.typography.fontSizeHeading,
		letterSpacing: lightTheme.typography.headingsLetterSpacing,
		color: lightTheme.colors.textColor,
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
	},
	forgotPassword: {
		alignSelf: 'center',
		fontSize: 14,
		textDecorationLine: 'underline',
		color: lightTheme.colors.labelColor,
		fontFamily: lightTheme.typography.fontFamily,
	},
	registerText: {
		textAlign: 'center',
		fontSize: 14,
		color: lightTheme.colors.textColor,
		fontFamily: lightTheme.typography.fontFamily,
	},
	registerLink: {
		color: lightTheme.colors.accentColor,
		textDecorationLine: 'underline',
	},
	errorText: {
		fontSize: 14,
		color: lightTheme.colors.error,
		fontFamily: lightTheme.typography.fontFamily,
	},
});
