import { useState } from 'react';

import { StyleSheet, View } from 'react-native';

import { useFormContext } from 'react-hook-form';

import { RHFInput, RHFPassword } from '@/shared/ui/inputs';

import type { IRegistrationFormType } from '../../model/registration.dto';

type Step1RegistrationProps = {
	isFetching?: boolean;
	onDone?: () => void;
};

export default function Step1Registration({ isFetching, onDone }: Step1RegistrationProps) {
	const { control, setFocus } = useFormContext<IRegistrationFormType>();
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
				returnKeyType="next"
				showClearButton
				onSubmitEditing={() => setFocus('password')}
			/>
			<RHFPassword
				control={control}
				name="password"
				label="Пароль"
				placeholder="Введите пароль"
				autoComplete="new-password"
				togglePassword={showPassword}
				returnKeyType="next"
				showClearButton
				onTogglePassword={() => setShowPassword((prev) => !prev)}
				onSubmitEditing={() => setFocus('confirmPassword')}
			/>
			<RHFPassword
				control={control}
				name="confirmPassword"
				label="Повторите пароль"
				placeholder="Подтвердите пароль"
				autoComplete="new-password"
				togglePassword={showPassword}
				returnKeyType="next"
				showClearButton
				onTogglePassword={() => setShowPassword((prev) => !prev)}
				onSubmitEditing={() => setFocus('promocode')}
			/>
			<RHFInput
				control={control}
				name="promocode"
				label="Есть промокод? (опционально)"
				placeholder="Введите промокод"
				returnKeyType="done"
				showClearButton
				onSubmitEditing={onDone}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 12,
	},
});
