import { useEffect, useMemo, useState } from 'react';

import {
	ActivityIndicator,
	Modal,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { router } from 'expo-router';
import { FormProvider, useForm } from 'react-hook-form';

import { getAxiosErrorMessage } from '@/shared/lib/get-axios-error-message';
import { lightTheme } from '@/shared/styles/tokens';

import {
	useCheckEmailDomains,
	useCourseQuery,
	useEmailCheck,
	useRegistrationMutation,
	useUniversityQuery,
} from '../../hook/useRegistrationQueries';
import type { IRegistrationFormType } from '../../model/registration.dto';
import { registrationSchema, step1Schema, step2Schema } from '../../schemas';
import Step1Registration from '../Step1Registration';
import Step2Registration from '../Step2Registration';
import Step3Registration from '../Step3Registration';
import StepControls from '../StepControls';

const maxStep = 3;

export default function RegistrationForm() {
	const [step, setStep] = useState(1);
	const [successRegistered, setSuccessRegistered] = useState(false);
	const [isValidating, setIsValidating] = useState(false);

	const stepSchema = useMemo(() => {
		if (step === 1) return step1Schema;
		if (step === 2) return step2Schema;
		return registrationSchema;
	}, [step]);

	const methods = useForm<IRegistrationFormType>({
		resolver: zodResolver(stepSchema) as any,
		mode: 'onTouched',
		defaultValues: {
			email: '',
			password: '',
			confirmPassword: '',
			promocode: '',
			firstName: '',
			lastName: '',
			specialisation: '',
			birthDate: '',
			sex: undefined,
			courseId: undefined,
			universityId: undefined,
			consent: false,
			file: null,
		},
	});

	const email = methods.watch('email');
	const { refetch, isFetching } = useEmailCheck(email);
	const { data: universities = [], isLoading: isUniversitiesLoading } = useUniversityQuery();
	const { data: courses = [], isLoading: isCoursesLoading } = useCourseQuery();
	const { mutateAsync: checkEmailDomains, isPending: isCheckingEmailDomains } =
		useCheckEmailDomains();
	const { mutateAsync: registration, isPending: isRegistrationPending } = useRegistrationMutation();

	useEffect(() => {
		if (!successRegistered) return;
		const timer = setTimeout(() => router.replace('/'), 3000);
		return () => clearTimeout(timer);
	}, [successRegistered]);

	const stepFields: Record<number, Array<keyof IRegistrationFormType>> = {
		1: ['email', 'password', 'confirmPassword', 'promocode'],
		2: ['firstName', 'lastName', 'sex', 'birthDate'],
		3: ['specialisation', 'universityId', 'courseId', 'consent'],
	};

	const onNext = async () => {
		if (isValidating) return;
		setIsValidating(true);
		const valid = await methods.trigger(stepFields[step], { shouldFocus: true });

		if (step === 1 && valid) {
			const { data } = await refetch();
			if (data) {
				methods.setError(
					'email',
					{
						type: 'value',
						message: 'Пользователь с таким email уже зарегистрирован',
					},
					{ shouldFocus: true },
				);
				setIsValidating(false);
				return;
			}
		}

		setIsValidating(false);
		if (!valid) return;
		setStep((s) => Math.min(s + 1, maxStep));
	};

	const onBack = () => setStep((s) => Math.max(s - 1, 1));

	const onSubmit = async (data: IRegistrationFormType) => {
		try {
			if (!data.file) {
				const checkResult = await checkEmailDomains({
					email: data.email,
					universityId: data.universityId,
				});
				if (!checkResult) {
					methods.setError(
						'file',
						{
							type: 'value',
							message: 'Файл обязателен',
						},
						{ shouldFocus: true },
					);
					return;
				}
			}

			await registration(data);
			setSuccessRegistered(true);
		} catch (error) {
			const message =
				error instanceof AxiosError
					? getAxiosErrorMessage(error, 'Ошибка сервера')
					: 'Ошибка сервера';
			methods.setError('consent', {
				type: 'server',
				message,
			});
		}
	};

	return (
		<>
			<FormProvider {...methods}>
				<ScrollView contentContainerStyle={styles.scrollContent}>
					<View style={styles.form}>
						<Text style={styles.title}>
							Регистрация {step}/{maxStep}
						</Text>

						{step === 1 ? <Step1Registration isFetching={isFetching} /> : null}
						{step === 2 ? <Step2Registration /> : null}
						{step === 3 ? (
							<Step3Registration
								universities={universities}
								courses={courses}
								isUniversitiesLoading={isUniversitiesLoading}
								isCoursesLoading={isCoursesLoading}
							/>
						) : null}

						<StepControls
							step={step}
							maxStep={maxStep}
							onNext={onNext}
							onBack={onBack}
							onSubmit={methods.handleSubmit(onSubmit)}
							isValidating={isValidating}
							isSubmitting={isCheckingEmailDomains || isRegistrationPending}
						/>

						{isCheckingEmailDomains || isRegistrationPending ? (
							<View style={styles.loaderContainer}>
								<ActivityIndicator color={lightTheme.colors.accentColor} />
							</View>
						) : null}
					</View>
				</ScrollView>
			</FormProvider>

			<Modal transparent animationType="fade" visible={successRegistered}>
				<View style={styles.backdrop}>
					<Pressable style={StyleSheet.absoluteFill} onPress={() => setSuccessRegistered(false)} />
					<View style={styles.modalCard}>
						<Text style={styles.modalTitle}>Благодарим за регистрацию!</Text>
						<Text style={styles.modalText}>
							Просим вас проверить почтовый ящик и подтвердить адрес электронной почты.
						</Text>
					</View>
				</View>
			</Modal>
		</>
	);
}

const styles = StyleSheet.create({
	scrollContent: {
		flexGrow: 1,
		padding: 16,
		backgroundColor: lightTheme.colors.background,
	},
	form: {
		width: '100%',
		maxWidth: 480,
		alignSelf: 'center',
		marginTop: 24,
		padding: 20,
		borderRadius: 24,
		borderWidth: 1,
		borderColor: lightTheme.colors.borderColor,
		gap: 14,
		backgroundColor: lightTheme.colors.bgWhite,
	},
	title: {
		fontSize: lightTheme.typography.fontSizeHeading,
		letterSpacing: lightTheme.typography.headingsLetterSpacing,
		color: lightTheme.colors.textColor,
		fontFamily: lightTheme.typography.fontFamilyHeadings,
	},
	loaderContainer: {
		alignItems: 'center',
	},
	backdrop: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 24,
		backgroundColor: 'rgba(0,0,0,0.4)',
	},
	modalCard: {
		width: '100%',
		maxWidth: 420,
		borderRadius: 20,
		padding: 20,
		gap: 12,
		backgroundColor: lightTheme.colors.bgWhite,
	},
	modalTitle: {
		fontSize: 24,
		color: lightTheme.colors.textColor,
		fontFamily: lightTheme.typography.fontFamilyHeadings,
	},
	modalText: {
		fontSize: 14,
		color: lightTheme.colors.textColor,
		fontFamily: lightTheme.typography.fontFamily,
	},
});
