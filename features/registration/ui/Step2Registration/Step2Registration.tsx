import { StyleSheet, View } from 'react-native';

import { useFormContext } from 'react-hook-form';

import { RHFDateInput, RHFInput, RHFSelectAutocomplete } from '@/shared/ui/inputs';

import type { IRegistrationFormType } from '../../model/registration.dto';

export default function Step2Registration() {
	const { control } = useFormContext<IRegistrationFormType>();

	const sexOptions = [
		{ value: true, label: 'Мужской' },
		{ value: false, label: 'Женский' },
	];

	return (
		<View style={styles.container}>
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
			<RHFSelectAutocomplete
				control={control}
				name="sex"
				label="Пол"
				placeholder="Выберите пол"
				options={sexOptions}
				defaultValue={sexOptions[0].value}
				searchable={false}
			/>
			<RHFDateInput control={control} name="birthDate" label="Дата рождения" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 12,
	},
});
