import { useEffect, useMemo, useState } from 'react';

import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { getAxiosErrorMessage } from '@/shared/lib/get-axios-error-message';
import { type AppTheme } from '@/shared/styles/tokens';
import Button from '@/shared/ui/Button';
import { RHFInput, RHFSelect } from '@/shared/ui/inputs';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

import { useSupportRequestMutation } from '../hook/useSupportRequestMutation';
import { supportCategoryOptions } from '../model/support-request.constants';

const SUPPORT_EMAIL = 'support@studmart.ru';

const supportRequestSchema = z.object({
	categoryId: z
		.number({ message: 'Выберите категорию вопроса' })
		.int('Выберите категорию вопроса')
		.positive('Выберите категорию вопроса'),
	question: z
		.string()
		.trim()
		.min(10, 'Введите вопрос (минимум 10 символов)')
		.max(2000, 'Слишком длинный текст вопроса'),
});

type SupportRequestFormValues = z.infer<typeof supportRequestSchema>;

type SupportRequestFormProps = {
	requesterName?: string;
	requesterEmail?: string;
};

export function SupportRequestForm({ requesterName, requesterEmail }: SupportRequestFormProps) {
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);
	const supportRequestMutation = useSupportRequestMutation();
	const [submitState, setSubmitState] = useState<{
		type: 'success' | 'error';
		message: string;
	} | null>(null);
	const { control, handleSubmit, reset } = useForm<SupportRequestFormValues>({
		resolver: zodResolver(supportRequestSchema),
		mode: 'onTouched',
		defaultValues: {
			categoryId: 0,
			question: '',
		},
	});

	useEffect(() => {
		if (submitState?.type !== 'success') return;

		const timer = setTimeout(() => {
			setSubmitState(null);
		}, 3500);

		return () => clearTimeout(timer);
	}, [submitState]);

	const onSubmit = async (values: SupportRequestFormValues) => {
		const selectedCategory = supportCategoryOptions.find(
			(option) => Number(option.value) === values.categoryId,
		);
		if (!selectedCategory) {
			setSubmitState({
				type: 'error',
				message: 'Выберите категорию вопроса',
			});
			return;
		}

		const trimmedName = requesterName?.trim();
		const from = trimmedName || requesterEmail?.trim() || 'Пользователь';
		setSubmitState(null);

		try {
			await supportRequestMutation.mutateAsync({
				name: selectedCategory.label,
				body: values.question.trim(),
				from,
			});

			setSubmitState({
				type: 'success',
				message: 'Вопрос успешно отправлен',
			});
			reset({
				categoryId: 0,
				question: '',
			});
		} catch (error) {
			const message =
				error instanceof AxiosError
					? getAxiosErrorMessage(error, 'Ошибка при отправке. Попробуйте позже.')
					: 'Ошибка при отправке. Попробуйте позже.';

			setSubmitState({
				type: 'error',
				message,
			});
		}
	};

	return (
		<View style={styles.card}>
			<Text style={styles.title}>Задайте свой вопрос</Text>
			<Text style={styles.description}>
				Выберите категорию и опишите ситуацию подробнее. Команда поддержки обработает обращение.
			</Text>

			<Pressable
				onPress={() => {
					void Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
				}}
			>
				<Text style={styles.link}>Или напишите на {SUPPORT_EMAIL}</Text>
			</Pressable>

			<View style={styles.formFields}>
				<RHFSelect
					control={control}
					name="categoryId"
					label="Категория вопроса"
					placeholder="Выберите категорию"
					options={supportCategoryOptions}
				/>
				<RHFInput
					control={control}
					name="question"
					label="Вопрос"
					placeholder="Введите ваш вопрос..."
					multiline
					rows={7}
					maxLength={2000}
					returnKeyType="done"
					blurOnSubmit
					onSubmitEditing={handleSubmit(onSubmit)}
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

			<Button
				onPress={handleSubmit(onSubmit)}
				disabled={supportRequestMutation.isPending}
				title={supportRequestMutation.isPending ? 'Отправка...' : 'Отправить вопрос'}
			/>
		</View>
	);
}

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
		card: {
			gap: 12,
		},
		title: {
			fontFamily: theme.typography.fontFamilyHeadings,
			fontSize: 20,
			color: theme.colors.textColor,
		},
		description: {
			fontFamily: theme.typography.fontFamily,
			fontSize: 14,
			lineHeight: 20,
			color: theme.colors.labelColor,
		},
		link: {
			fontFamily: theme.typography.fontFamily,
			fontSize: 14,
			color: theme.colors.accentColor,
			textDecorationLine: 'underline',
		},
		formFields: {
			gap: 10,
		},
		submitMessage: {
			fontFamily: theme.typography.fontFamily,
			fontSize: 14,
		},
		successText: {
			color: theme.colors.success,
		},
		errorText: {
			color: theme.colors.error,
		},
	});
