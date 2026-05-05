import { useEffect, useMemo, useState } from 'react';

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useAtomValue } from 'jotai';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { authAtom } from '@/entities/auth/model/auth.store';
import { useUserProfile } from '@/entities/user/hook/useUserProfile';
import { useUserProfileMutations } from '@/entities/user/hook/useUserProfileMutations';
import type { IUserProfileDto, IUserProfileUpdatePayload } from '@/entities/user/model/user.dto';

import { getAxiosErrorMessage } from '@/shared/lib/get-axios-error-message';
import { type AppTheme } from '@/shared/styles/tokens';
import Button from '@/shared/ui/Button';
import GradientBackHeaderLayout from '@/shared/ui/GradientBackHeaderLayout';
import { RHFInput } from '@/shared/ui/inputs';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

const NAME_REGEX = /^[a-zA-Zа-яА-ЯёЁ]+(?:[ '\-][a-zA-Zа-яА-ЯёЁ]+)*$/;

const credentialsSchema = z.object({
	firstName: z
		.string()
		.trim()
		.min(2, 'Введите имя (минимум 2 символа)')
		.regex(NAME_REGEX, 'Имя содержит недопустимые символы'),
	lastName: z
		.string()
		.trim()
		.min(2, 'Введите фамилию (минимум 2 символа)')
		.regex(NAME_REGEX, 'Фамилия содержит недопустимые символы'),
	patronymic: z
		.string()
		.trim()
		.min(2, 'Введите отчество (минимум 2 символа)')
		.regex(NAME_REGEX, 'Отчество содержит недопустимые символы'),
	inn: z
		.string()
		.trim()
		.regex(/^\d{12}$/, 'ИНН должен содержать 12 цифр'),
	accountNumber: z
		.string()
		.trim()
		.regex(/^\d{20}$/, 'Номер счета должен содержать 20 цифр'),
	bik: z
		.string()
		.trim()
		.regex(/^\d{9}$/, 'БИК должен содержать 9 цифр'),
});

type CredentialsFormValues = z.infer<typeof credentialsSchema>;

const digitsFormatter =
	(maxLength: number) =>
	(value: string): string =>
		value.replace(/\D/g, '').slice(0, maxLength);

const toIsoDate = (value?: string | null) => {
	if (!value) {
		return '';
	}

	return value.includes('T') ? value.split('T')[0] : value;
};

const createCredentialsUpdatePayload = (
	studentId: string,
	profile: IUserProfileDto,
	values: CredentialsFormValues,
): IUserProfileUpdatePayload => ({
	id: studentId,
	firstName: values.firstName.trim(),
	lastName: values.lastName.trim(),
	sex: profile.sex ?? true,
	birthDate: toIsoDate(profile.birthDate),
	email: profile.email ?? '',
	specialisation: profile.specialisation ?? '',
	status: profile.status ?? null,
	universityId: profile.university?.id ?? 0,
	regionId: profile.region?.id ?? null,
	balance: profile.balance ?? 0,
	hasWork: profile.hasWork ?? false,
	cityId: profile.city?.id ?? null,
	languageIds: (profile.languages ?? []).map((language) => language.id),
	courseId: profile.course?.id ?? 0,
	paymentInformation: {
		inn: Number(values.inn),
		bik: values.bik.trim(),
		accountNumber: values.accountNumber.trim(),
		patronymic: values.patronymic.trim(),
	},
});

export default function StudentCredentialsPage() {
	const { id: studentId } = useAtomValue(authAtom);
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);
	const { profile, isLoading, isError, refetch } = useUserProfile(studentId);
	const { updateProfile } = useUserProfileMutations(studentId);
	const [submitState, setSubmitState] = useState<{
		type: 'success' | 'error';
		message: string;
	} | null>(null);

	const { control, handleSubmit, reset, setFocus } = useForm<CredentialsFormValues>({
		resolver: zodResolver(credentialsSchema),
		mode: 'onTouched',
		defaultValues: {
			firstName: '',
			lastName: '',
			patronymic: '',
			inn: '',
			accountNumber: '',
			bik: '',
		},
	});

	useEffect(() => {
		if (!profile) {
			return;
		}

		reset({
			firstName: profile.firstName ?? '',
			lastName: profile.lastName ?? '',
			patronymic: profile.paymentInformation?.patronymic ?? '',
			inn: profile.paymentInformation?.inn ? String(profile.paymentInformation.inn) : '',
			accountNumber: profile.paymentInformation?.accountNumber ?? '',
			bik: profile.paymentInformation?.bik ?? '',
		});
	}, [profile, reset]);

	useEffect(() => {
		if (submitState?.type !== 'success') {
			return;
		}

		const timer = setTimeout(() => {
			setSubmitState(null);
		}, 3000);

		return () => clearTimeout(timer);
	}, [submitState]);

	const onSubmit = async (values: CredentialsFormValues) => {
		if (!studentId || !profile) {
			return;
		}

		try {
			await updateProfile.mutateAsync(createCredentialsUpdatePayload(studentId, profile, values));
			setSubmitState({
				type: 'success',
				message: 'Реквизиты успешно сохранены',
			});
		} catch (error) {
			const message =
				error instanceof AxiosError
					? getAxiosErrorMessage(error, 'Не удалось сохранить реквизиты')
					: 'Не удалось сохранить реквизиты';
			setSubmitState({
				type: 'error',
				message,
			});
		}
	};

	return (
		<GradientBackHeaderLayout title="Банковские реквизиты">
			{!studentId ? <Text style={styles.subtitle}>Пользователь не авторизован</Text> : null}

			{studentId ? (
				<View style={styles.container}>
					{isLoading ? (
						<View style={styles.loaderContainer}>
							<ActivityIndicator size="small" color={theme.colors.accentColor} />
						</View>
					) : null}

					{isError ? (
						<View style={styles.errorContainer}>
							<Text style={styles.errorText}>Не удалось загрузить данные профиля</Text>
							<Button onPress={() => void refetch()} variant="white">
								Повторить
							</Button>
						</View>
					) : null}

					{!isLoading && !isError && profile ? (
						<View style={styles.formCard}>
							<View style={styles.sectionCard}>
								<Text style={styles.sectionTitle}>Личные данные получателя</Text>
								<View style={styles.formFields}>
									<RHFInput
										control={control}
										name="firstName"
										label="Имя"
										placeholder="Введите имя"
										returnKeyType="next"
										showClearButton
										onSubmitEditing={() => setFocus('lastName')}
									/>
									<RHFInput
										control={control}
										name="lastName"
										label="Фамилия"
										placeholder="Введите фамилию"
										returnKeyType="next"
										showClearButton
										onSubmitEditing={() => setFocus('patronymic')}
									/>
									<RHFInput
										control={control}
										name="patronymic"
										label="Отчество"
										placeholder="Введите отчество"
										returnKeyType="next"
										showClearButton
										onSubmitEditing={() => setFocus('inn')}
									/>
								</View>
							</View>

							<View style={styles.sectionCard}>
								<Text style={styles.sectionTitle}>Платежные реквизиты</Text>
								<View style={styles.formFields}>
									<RHFInput
										control={control}
										name="inn"
										label="ИНН физического лица"
										placeholder="12 цифр"
										type="number"
										formatter={digitsFormatter(12)}
										returnKeyType="next"
										showClearButton
										onSubmitEditing={() => setFocus('accountNumber')}
									/>
									<RHFInput
										control={control}
										name="accountNumber"
										label="Номер счета"
										placeholder="20 цифр"
										type="number"
										formatter={digitsFormatter(20)}
										returnKeyType="next"
										showClearButton
										onSubmitEditing={() => setFocus('bik')}
									/>
									<RHFInput
										control={control}
										name="bik"
										label="БИК банка"
										placeholder="9 цифр"
										type="number"
										formatter={digitsFormatter(9)}
										returnKeyType="done"
										showClearButton
										onSubmitEditing={handleSubmit(onSubmit)}
									/>
								</View>
							</View>

							{submitState ? (
								<Text
									style={[
										styles.submitMessage,
										submitState.type === 'success' ? styles.successText : styles.errorText,
									]}
								>
									{submitState.message}
								</Text>
							) : null}

							<Button disabled={updateProfile.isPending} onPress={handleSubmit(onSubmit)}>
								{updateProfile.isPending ? 'Сохраняем...' : 'Сохранить'}
							</Button>
						</View>
					) : null}
				</View>
			) : null}
		</GradientBackHeaderLayout>
	);
}

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
		container: {
			gap: 14,
			paddingBottom: 48,
		},
		loaderContainer: {
			paddingVertical: 20,
			alignItems: 'center',
		},
		errorContainer: {
			gap: 12,
		},
		formCard: {
			gap: 12,
		},
		sectionCard: {
			gap: 10,
		},
		sectionTitle: {
			fontFamily: theme.typography.fontFamilyHeadings,
			fontSize: 18,
			color: theme.colors.textColor,
		},
		formFields: {
			gap: 10,
		},
		subtitle: {
			fontFamily: theme.typography.fontFamily,
			fontSize: 16,
			color: theme.colors.labelColor,
		},
		errorText: {
			fontFamily: theme.typography.fontFamily,
			fontSize: 14,
			color: theme.colors.error,
		},
		successText: {
			color: theme.colors.success,
		},
		submitMessage: {
			fontFamily: theme.typography.fontFamily,
			fontSize: 14,
		},
	});
