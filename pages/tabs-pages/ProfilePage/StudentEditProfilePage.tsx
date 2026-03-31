import { useEffect, useMemo, useState } from 'react';

import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import { useAtomValue, useSetAtom } from 'jotai';
import { Camera } from 'lucide-react-native';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { authAtom } from '@/entities/auth/model/auth.store';
import { useCityRegionQuery } from '@/entities/city-region/hook/useCityRegionQuery';
import { useUserProfile } from '@/entities/user/hook/useUserProfile';
import { useUserProfileFormDictionaries } from '@/entities/user/hook/useUserProfileFormDictionaries';
import { useUserProfileMutations } from '@/entities/user/hook/useUserProfileMutations';
import type { IUserProfileDto, IUserProfileUpdatePayload } from '@/entities/user/model/user.dto';
import { bumpUserAvatarVersionAtom } from '@/entities/user/model/user.store';

import { FILE_API } from '@/shared/api/urls';
import { documentPickerAssetToBase64 } from '@/shared/lib/file-to-base64';
import { getAxiosErrorMessage } from '@/shared/lib/get-axios-error-message';
import { type AppTheme } from '@/shared/styles/tokens';
import Button from '@/shared/ui/Button';
import GradientBackHeaderLayout from '@/shared/ui/GradientBackHeaderLayout';
import {
	RHFDateInput,
	RHFInput,
	RHFSelect,
	RHFSelectAutocomplete,
	type SelectOption,
} from '@/shared/ui/inputs';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;
const ISO_DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;
const NAME_REGEX = /^[a-zA-Zа-яА-ЯёЁ]+(?:[ '\-][a-zA-Zа-яА-ЯёЁ]+)*$/;

const sexOptions: SelectOption[] = [
	{ value: true, label: 'Мужской' },
	{ value: false, label: 'Женский' },
];

const familyStatusOptions: SelectOption[] = [
	{ value: 1, label: 'Женат / Замужем' },
	{ value: 2, label: 'Холост / Не замужем' },
	{ value: 3, label: 'Разведен / Разведена' },
	{ value: 4, label: 'Вдовец / Вдова' },
];

const employmentOptions: SelectOption[] = [
	{ value: true, label: 'Работает' },
	{ value: false, label: 'Не работает' },
];

const parseIsoDate = (value: string): Date | null => {
	if (!ISO_DATE_FORMAT.test(value)) return null;

	const [yyyy, mm, dd] = value.split('-').map(Number);
	const parsed = new Date(yyyy, mm - 1, dd);

	if (
		Number.isNaN(parsed.getTime()) ||
		parsed.getFullYear() !== yyyy ||
		parsed.getMonth() !== mm - 1 ||
		parsed.getDate() !== dd
	) {
		return null;
	}

	return parsed;
};

const toIsoDate = (value?: string | null) => {
	if (!value) return '';

	const raw = value.includes('T') ? value.split('T')[0] : value;
	return ISO_DATE_FORMAT.test(raw) ? raw : '';
};

const editProfileSchema = z.object({
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
	birthDate: z
		.string()
		.trim()
		.regex(ISO_DATE_FORMAT, 'Неверный формат даты')
		.refine((value) => Boolean(parseIsoDate(value)), 'Несуществующая дата')
		.refine((value) => {
			const parsed = parseIsoDate(value);
			return parsed ? parsed <= new Date() : true;
		}, 'Дата из будущего недопустима'),
	sex: z.boolean({ message: 'Выберите пол' }),
	status: z
		.number({ message: 'Выберите семейное положение' })
		.int('Выберите семейное положение')
		.positive('Выберите семейное положение'),
	hasWork: z.boolean({ message: 'Выберите статус занятости' }),
	specialisation: z.string().trim().min(2, 'Введите специальность'),
	universityId: z
		.number({ message: 'Выберите университет' })
		.int('Выберите университет')
		.positive('Выберите университет'),
	courseId: z.number({ message: 'Выберите курс' }).int('Выберите курс').positive('Выберите курс'),
	regionId: z
		.number({ message: 'Выберите регион' })
		.int('Выберите регион')
		.positive('Выберите регион'),
	cityId: z.number({ message: 'Выберите город' }).int('Выберите город').positive('Выберите город'),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

const mapToSelectOptions = (items?: { id: number; name: string }[]): SelectOption[] =>
	(items ?? []).map((item) => ({
		value: item.id,
		label: item.name,
	}));

const createUpdatePayload = (
	studentId: string,
	profile: IUserProfileDto,
	values: EditProfileFormValues,
): IUserProfileUpdatePayload => ({
	id: studentId,
	firstName: values.firstName.trim(),
	lastName: values.lastName.trim(),
	sex: values.sex,
	birthDate: values.birthDate,
	email: profile.email ?? '',
	specialisation: values.specialisation.trim(),
	status: values.status,
	universityId: values.universityId,
	regionId: values.regionId,
	balance: profile.balance ?? 0,
	hasWork: values.hasWork,
	cityId: values.cityId,
	languageIds: (profile.languages ?? []).map((language) => language.id),
	courseId: values.courseId,
	paymentInformation: profile.paymentInformation ?? null,
});

export default function StudentEditProfilePage() {
	const { id: studentId } = useAtomValue(authAtom);
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);
	const { profile, isLoading, isError, refetch } = useUserProfile(studentId);
	const { updateProfile, uploadAvatar } = useUserProfileMutations(studentId);
	const [avatarPreviewUri, setAvatarPreviewUri] = useState<string | null>(null);
	const [avatarRefreshKey, setAvatarRefreshKey] = useState(() => Date.now());
	const [hasAvatarError, setHasAvatarError] = useState(false);
	const [avatarErrorText, setAvatarErrorText] = useState<string | null>(null);
	const [avatarSuccessText, setAvatarSuccessText] = useState<string | null>(null);
	const bumpAvatarVersion = useSetAtom(bumpUserAvatarVersionAtom);
	const [submitState, setSubmitState] = useState<{
		type: 'success' | 'error';
		message: string;
	} | null>(null);

	const { control, handleSubmit, reset, setValue, watch } = useForm<EditProfileFormValues>({
		resolver: zodResolver(editProfileSchema),
		mode: 'onTouched',
		defaultValues: {
			firstName: '',
			lastName: '',
			birthDate: '',
			sex: true,
			status: 0,
			hasWork: false,
			specialisation: '',
			universityId: 0,
			courseId: 0,
			regionId: 0,
			cityId: 0,
		},
	});

	const firstName = watch('firstName');
	const lastName = watch('lastName');
	const selectedRegionId = watch('regionId');
	const selectedCityId = watch('cityId');
	const activeRegionId = selectedRegionId > 0 ? selectedRegionId : undefined;
	const { regions, isLoading: isRegionsLoading } = useCityRegionQuery({
		enabled: Boolean(studentId),
	});
	const { universitiesQuery, coursesQuery, citiesQuery } = useUserProfileFormDictionaries({
		regionId: activeRegionId,
		enabled: Boolean(studentId),
	});

	const regionOptions = useMemo(() => mapToSelectOptions(regions), [regions]);
	const cityOptions = useMemo(() => mapToSelectOptions(citiesQuery.data), [citiesQuery.data]);
	const universityOptions = useMemo(
		() => mapToSelectOptions(universitiesQuery.data),
		[universitiesQuery.data],
	);
	const courseOptions = useMemo(() => mapToSelectOptions(coursesQuery.data), [coursesQuery.data]);

	useEffect(() => {
		if (!profile) return;

		reset({
			firstName: profile.firstName ?? '',
			lastName: profile.lastName ?? '',
			birthDate: toIsoDate(profile.birthDate),
			sex: profile.sex ?? true,
			status: profile.status ?? 0,
			hasWork: profile.hasWork ?? false,
			specialisation: profile.specialisation ?? '',
			universityId: profile.university?.id ?? 0,
			courseId: profile.course?.id ?? 0,
			regionId: profile.region?.id ?? 0,
			cityId: profile.city?.id ?? 0,
		});
	}, [profile, reset]);

	useEffect(() => {
		if (!activeRegionId || selectedCityId === 0) return;
		if (!citiesQuery.isSuccess) return;

		const cityExists = cityOptions.some((city) => Number(city.value) === selectedCityId);
		if (!cityExists) {
			setValue('cityId', 0, { shouldValidate: true });
		}
	}, [activeRegionId, citiesQuery.isSuccess, cityOptions, selectedCityId, setValue]);

	useEffect(() => {
		if (submitState?.type !== 'success') return;

		const timer = setTimeout(() => {
			setSubmitState(null);
		}, 3000);

		return () => clearTimeout(timer);
	}, [submitState]);

	useEffect(() => {
		if (!avatarSuccessText) return;

		const timer = setTimeout(() => {
			setAvatarSuccessText(null);
		}, 3000);

		return () => clearTimeout(timer);
	}, [avatarSuccessText]);

	useEffect(() => {
		setAvatarPreviewUri(null);
		setHasAvatarError(false);
		setAvatarSuccessText(null);
		setAvatarRefreshKey(Date.now());
	}, [studentId]);

	const avatarUri = useMemo(() => {
		if (avatarPreviewUri) return avatarPreviewUri;
		if (!studentId) return null;
		return `${FILE_API}/Avatars/${studentId}?t=${avatarRefreshKey}`;
	}, [avatarPreviewUri, avatarRefreshKey, studentId]);

	const initials = useMemo(() => {
		const computed = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.trim().toUpperCase();
		return computed || 'U';
	}, [firstName, lastName]);

	const onSubmit = async (values: EditProfileFormValues) => {
		if (!studentId || !profile) return;

		try {
			await updateProfile.mutateAsync(createUpdatePayload(studentId, profile, values));
			setSubmitState({
				type: 'success',
				message: 'Профиль успешно сохранен',
			});
		} catch (error) {
			const message =
				error instanceof AxiosError
					? getAxiosErrorMessage(error, 'Не удалось сохранить профиль')
					: 'Не удалось сохранить профиль';
			setSubmitState({
				type: 'error',
				message,
			});
		}
	};

	const onAvatarPress = async () => {
		if (!studentId || uploadAvatar.isPending) return;

		setAvatarErrorText(null);
		setAvatarSuccessText(null);
		const result = await DocumentPicker.getDocumentAsync({
			type: ['image/*'],
			multiple: false,
		});

		if (result.canceled) return;

		const selectedAsset = result.assets[0];
		if (!selectedAsset?.uri) {
			setAvatarErrorText('Не удалось выбрать изображение');
			return;
		}

		if ((selectedAsset.size ?? 0) > MAX_AVATAR_SIZE_BYTES) {
			setAvatarErrorText('Файл слишком большой. Максимальный размер: 5 МБ.');
			return;
		}

		setAvatarPreviewUri(selectedAsset.uri);
		setHasAvatarError(false);

		try {
			const image = await documentPickerAssetToBase64(selectedAsset);

			await uploadAvatar.mutateAsync({
				id: studentId,
				image,
				contentType: selectedAsset.mimeType ?? 'image/jpeg',
			});
			setAvatarRefreshKey(Date.now());
			bumpAvatarVersion(studentId);
			setAvatarSuccessText('Изображение загружено');
		} catch (error) {
			setAvatarPreviewUri(null);
			setAvatarSuccessText(null);
			const message =
				error instanceof AxiosError
					? getAxiosErrorMessage(error, 'Не удалось загрузить аватар')
					: 'Не удалось загрузить аватар';
			setAvatarErrorText(message);
		}
	};

	return (
		<GradientBackHeaderLayout title="Личная информация">
			{!studentId ? <Text style={styles.subtitle}>Пользователь не авторизован</Text> : null}

			{studentId ? (
				<View style={styles.container}>
					<View style={styles.avatarSection}>
						<Pressable
							style={styles.avatarPressable}
							onPress={() => void onAvatarPress()}
							disabled={uploadAvatar.isPending}
						>
							<View style={styles.avatarCircle}>
								{avatarUri && !hasAvatarError ? (
									<Image
										source={{ uri: avatarUri }}
										style={styles.avatarImage}
										onError={() => setHasAvatarError(true)}
									/>
								) : (
									<Text style={styles.avatarFallbackText}>{initials}</Text>
								)}
							</View>
							<View style={styles.cameraBadge}>
								{uploadAvatar.isPending ? (
									<ActivityIndicator size="small" color={theme.colors.accentTextColor} />
								) : (
									<Camera size={16} color={theme.colors.accentTextColor} />
								)}
							</View>
						</Pressable>
						<Text style={styles.avatarHint}>Нажмите на аватар, чтобы изменить фото</Text>
						{profile?.email ? <Text style={styles.avatarEmail}>{profile.email}</Text> : null}
						{avatarSuccessText ? (
							<Text style={[styles.submitMessage, styles.successText]}>{avatarSuccessText}</Text>
						) : null}
						{avatarErrorText ? <Text style={styles.errorText}>{avatarErrorText}</Text> : null}
					</View>

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
							<Text style={styles.sectionTitle}>Основная информация</Text>
							<View style={styles.formFields}>
								<RHFInput
									control={control}
									name="firstName"
									label="Имя"
									placeholder="Введите имя"
									showClearButton
								/>
								<RHFInput
									control={control}
									name="lastName"
									label="Фамилия"
									placeholder="Введите фамилию"
									showClearButton
								/>
								<RHFDateInput control={control} name="birthDate" label="Дата рождения" />
								<RHFSelect
									control={control}
									name="sex"
									label="Пол"
									placeholder="Выберите пол"
									options={sexOptions}
								/>
								<RHFSelect
									control={control}
									name="status"
									label="Семейное положение"
									placeholder="Выберите семейное положение"
									options={familyStatusOptions}
								/>
								<RHFSelect
									control={control}
									name="hasWork"
									label="Статус занятости"
									placeholder="Выберите статус занятости"
									options={employmentOptions}
								/>
							</View>

							<Text style={styles.sectionTitle}>Учеба и локация</Text>
							<View style={styles.formFields}>
								<RHFInput
									control={control}
									name="specialisation"
									label="Специальность"
									placeholder="Введите специальность"
									showClearButton
								/>
								<RHFSelectAutocomplete
									control={control}
									name="universityId"
									label="Университет"
									placeholder="Выберите университет"
									options={universityOptions}
									showClearButton
									isLoading={universitiesQuery.isLoading}
								/>
								<RHFSelectAutocomplete
									control={control}
									name="courseId"
									label="Курс"
									placeholder="Выберите курс"
									options={courseOptions}
									showClearButton
									isLoading={coursesQuery.isLoading}
								/>
								<RHFSelectAutocomplete
									control={control}
									name="regionId"
									label="Регион"
									placeholder="Выберите регион"
									options={regionOptions}
									showClearButton
									isLoading={isRegionsLoading}
								/>
								<RHFSelectAutocomplete
									control={control}
									name="cityId"
									label="Город"
									placeholder="Выберите город"
									options={cityOptions}
									showClearButton
									disabled={!activeRegionId}
									isLoading={citiesQuery.isLoading}
								/>
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
								{updateProfile.isPending ? 'Сохраняем...' : 'Сохранить изменения'}
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
			gap: 16,
		},
		avatarSection: {
			alignItems: 'center',
			gap: 6,
		},
		avatarPressable: {
			position: 'relative',
			width: 104,
			height: 104,
			overflow: 'visible',
		},
		avatarCircle: {
			width: 104,
			height: 104,
			borderRadius: 56,
			overflow: 'hidden',
			borderWidth: 1,
			borderColor: theme.colors.borderColor,
			backgroundColor: theme.colors.bgSecondary,
			alignItems: 'center',
			justifyContent: 'center',
		},
		avatarImage: {
			width: '100%',
			height: '100%',
		},
		avatarFallbackText: {
			fontFamily: theme.typography.fontFamilyHeadings,
			fontSize: 42,
			fontWeight: 700,
			color: theme.colors.textColor,
		},
		cameraBadge: {
			position: 'absolute',
			right: -4,
			bottom: -4,
			width: 32,
			height: 32,
			borderRadius: 16,
			borderWidth: 1,
			borderColor: theme.colors.borderColor,
			backgroundColor: theme.colors.accentColor,
			alignItems: 'center',
			justifyContent: 'center',
			zIndex: 3,
			elevation: 3,
		},
		avatarHint: {
			fontFamily: theme.typography.fontFamily,
			fontSize: 13,
			color: theme.colors.labelColor,
			textAlign: 'center',
		},
		avatarEmail: {
			fontFamily: theme.typography.fontFamily,
			fontSize: 14,
			color: theme.colors.textColor,
			textAlign: 'center',
		},
		loaderContainer: {
			paddingVertical: 20,
			alignItems: 'center',
		},
		formCard: {
			gap: 12,
		},
		formFields: {
			gap: 10,
		},
		sectionTitle: {
			fontFamily: theme.typography.fontFamilyHeadings,
			fontSize: 18,
			color: theme.colors.textColor,
		},
		errorContainer: {
			gap: 12,
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
