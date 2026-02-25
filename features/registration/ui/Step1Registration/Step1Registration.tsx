import { useState } from 'react';

import { StyleSheet, View } from 'react-native';

import { useFormContext } from 'react-hook-form';

import { RHFInput, RHFPassword } from '@/shared/ui/inputs';

import type { IRegistrationFormType } from '../../model/registration.dto';

export default function Step1Registration({ isFetching }: { isFetching?: boolean }) {
	const { control } = useFormContext<IRegistrationFormType>();
	const [showPassword, setShowPassword] = useState(false);

	return (
		<View style={styles.container}>
			<RHFInput
				control={control}
				name="email"
				autoComplete="email"
				label="Почта"
				placeholder="example@mail.com"
				isLoading={isFetching}
				showClearButton
			/>
			<RHFPassword
				control={control}
				name="password"
				label="Пароль"
				placeholder="Введите пароль"
				autoComplete="new-password"
				togglePassword={showPassword}
				showClearButton
				onTogglePassword={() => setShowPassword((prev) => !prev)}
			/>
			<RHFPassword
				control={control}
				name="confirmPassword"
				label="Повторите пароль"
				placeholder="Подтвердите пароль"
				autoComplete="new-password"
				togglePassword={showPassword}
				showClearButton
				onTogglePassword={() => setShowPassword((prev) => !prev)}
			/>
			<RHFInput
				control={control}
				name="promocode"
				label="Есть промокод? (опционально)"
				placeholder="Введите промокод"
				showClearButton
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 12,
	},
});
