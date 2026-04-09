import { useMemo } from 'react';

import { Linking, StyleSheet, Text, View } from 'react-native';

import { useFormContext } from 'react-hook-form';

import { type AppTheme } from '@/shared/styles/tokens';
import { RHFCheckbox, RHFFileInput, RHFInput, RHFSelectAutocomplete } from '@/shared/ui/inputs';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

import type {
	ICourseDTO,
	IRegistrationFormType,
	IUniversityDTO,
} from '../../model/registration.dto';

const PRIVACY_POLICY_URL = encodeURI(
	'https://students.studmart-dev.inxan.ru/files/Политика конфиденциальности.pdf',
);

interface IStep3RegistrationProps {
	universities?: IUniversityDTO[];
	courses?: ICourseDTO[];
	isUniversitiesLoading?: boolean;
	isCoursesLoading?: boolean;
}

export default function Step3Registration({
	universities,
	courses,
	isUniversitiesLoading,
	isCoursesLoading,
}: IStep3RegistrationProps) {
	const { control } = useFormContext<IRegistrationFormType>();
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);

	const universityOptions = (universities ?? []).map((university) => ({
		value: Number(university.id),
		label: university.name,
	}));
	const coursesOptions = (courses ?? []).map((course) => ({
		value: Number(course.id),
		label: course.name,
	}));

	return (
		<View style={styles.container}>
			<RHFSelectAutocomplete
				control={control}
				name="universityId"
				label="Университет"
				placeholder="Выберите университет"
				options={universityOptions}
				showClearButton
				isLoading={isUniversitiesLoading}
			/>
			<RHFInput
				control={control}
				name="specialisation"
				label="Специальность"
				placeholder="Введите специальность"
				returnKeyType="done"
				showClearButton
			/>
			<RHFSelectAutocomplete
				control={control}
				name="courseId"
				label="Курс"
				placeholder="Выберите курс"
				options={coursesOptions}
				showClearButton
				isLoading={isCoursesLoading}
			/>
			<RHFFileInput
				control={control}
				name="file"
				label="Документ, подтверждающий статус студента"
				maxSizeMb={20}
				allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
			/>
			<RHFCheckbox control={control} name="consent">
				<View style={styles.consentRow}>
					<Text style={styles.consentText}>Даю согласие на обработку персональных данных. </Text>
					<Text
						style={styles.link}
						onPress={() => {
							Linking.openURL(PRIVACY_POLICY_URL);
						}}
					>
						Ознакомиться с документом
					</Text>
				</View>
			</RHFCheckbox>
		</View>
	);
}

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
		container: {
			gap: 12,
		},
		consentRow: {
			flexDirection: 'row',
			flexWrap: 'wrap',
		},
		consentText: {
			fontSize: 14,
			color: theme.colors.textColor,
			fontFamily: theme.typography.fontFamily,
		},
		link: {
			fontSize: 14,
			textDecorationLine: 'underline',
			color: theme.colors.accentColor,
			fontFamily: theme.typography.fontFamily,
		},
	});
