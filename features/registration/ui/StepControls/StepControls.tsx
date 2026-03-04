import { StyleSheet, Text, View } from 'react-native';

import { Link } from 'expo-router';

import { lightTheme } from '@/shared/styles/tokens';
import Button from '@/shared/ui/Button';

interface IStepControlsProps {
	isValidating?: boolean;
	isSubmitting?: boolean;
	step: number;
	maxStep: number;
	onNext: () => void;
	onBack: () => void;
	onSubmit: () => void;
}

export default function StepControls({
	step,
	maxStep,
	onNext,
	onBack,
	onSubmit,
	isValidating,
	isSubmitting,
}: IStepControlsProps) {
	const isLast = maxStep === step;
	const isBusy = Boolean(isValidating || isSubmitting);

	return (
		<>
			<View style={styles.wrapper}>
				{step > 1 ? (
					<View style={styles.buttonWrap}>
						<Button variant="secondary" onPress={onBack}>
							Назад
						</Button>
					</View>
				) : null}
				{!isLast ? (
					<View style={styles.buttonWrap}>
						<Button onPress={onNext} disabled={isBusy}>
							{isValidating ? 'Проверяем...' : 'Далее'}
						</Button>
					</View>
				) : (
					<View style={styles.buttonWrap}>
						<Button onPress={onSubmit} disabled={isBusy}>
							{isBusy ? 'Проверяем...' : 'Завершить'}
						</Button>
					</View>
				)}
			</View>

			<Text style={styles.loginText}>
				Уже есть аккаунт?{' '}
				<Link href="/login" style={styles.loginLink}>
					Войти
				</Link>
			</Text>
		</>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		flexDirection: 'column-reverse',
		gap: 10,
	},
	buttonWrap: {
		flex: 1,
	},
	loginText: {
		textAlign: 'center',
		color: lightTheme.colors.textColor,
		fontFamily: lightTheme.typography.fontFamily,
		fontSize: 14,
	},
	loginLink: {
		textDecorationLine: 'underline',
		color: lightTheme.colors.accentColor,
	},
});
