import { Pressable, Text, TextInput, View } from 'react-native';

import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { LoginForm } from './LoginForm';

const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockLogin = jest.fn();
const mockUseAtom = jest.fn();

jest.mock('axios', () => ({
	__esModule: true,
	AxiosError: class AxiosError extends Error {},
	default: {
		create: jest.fn(() => ({})),
	},
}));

jest.mock('expo-router', () => ({
	__esModule: true,
	router: {
		replace: (...args: unknown[]) => mockReplace(...args),
		push: (...args: unknown[]) => mockPush(...args),
	},
}));

jest.mock('jotai', () => ({
	useAtom: (...args: unknown[]) => mockUseAtom(...args),
}));

jest.mock('@/entities/auth/model/auth.store', () => ({
	loginAtom: Symbol('loginAtom'),
}));

jest.mock('@/shared/ui/theme/ThemeProvider', () => {
	const { lightTheme } = require('@/shared/styles/tokens');

	return {
		useTheme: () => ({
			theme: lightTheme,
			scheme: 'light',
			themeMode: 'light',
			setThemeMode: jest.fn(),
		}),
	};
});

jest.mock('@/shared/ui/Button', () => {
	const React = require('react');
	const { Pressable, Text } = require('react-native');

	return function MockButton({ children, onPress, disabled, variant }: any) {
		return (
			<Pressable
				accessibilityRole="button"
				accessibilityLabel={typeof children === 'string' ? children : undefined}
				onPress={onPress}
				disabled={disabled}
			>
				<Text>{variant ? `${variant}:${children}` : children}</Text>
			</Pressable>
		);
	};
});

jest.mock('@/shared/ui/inputs', () => {
	const React = require('react');
	const { Text, TextInput, View } = require('react-native');
	const { Controller } = require('react-hook-form');

	const renderField = ({ control, name, label, placeholder }: any) => (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<View>
					<Text>{label ?? name}</Text>
					<TextInput
						testID={`field-${name}`}
						placeholder={placeholder}
						value={field.value == null ? '' : String(field.value)}
						onChangeText={field.onChange}
						onBlur={field.onBlur}
					/>
					{fieldState.error?.message ? <Text>{fieldState.error.message}</Text> : null}
				</View>
			)}
		/>
	);

	return {
		RHFInput: renderField,
		RHFPassword: renderField,
	};
});

jest.mock('./ForgotPasswordModal', () => {
	const React = require('react');
	const { Text } = require('react-native');

	return {
		ForgotPasswordModal: ({ visible }: { visible: boolean }) =>
			visible ? <Text>forgot-password-modal</Text> : null,
	};
});

describe('LoginForm', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockUseAtom.mockReturnValue([
			{
				isLoading: false,
			},
			mockLogin,
		]);
	});

	it('shows validation errors for invalid form values', async () => {
		render(<LoginForm />);

		fireEvent.changeText(screen.getByTestId('field-email'), 'bad-email');
		fireEvent.changeText(screen.getByTestId('field-password'), '123');
		fireEvent.press(screen.getByRole('button', { name: 'Войти' }));

		await waitFor(() => {
			expect(screen.getByText('Некорректный email')).toBeTruthy();
		});
		expect(screen.getByText('Пароль должен содержать минимум 6 символов')).toBeTruthy();
		expect(mockLogin).not.toHaveBeenCalled();
	});

	it('submits credentials and redirects on success', async () => {
		mockLogin.mockResolvedValue({ success: true, error: null });
		render(<LoginForm />);

		fireEvent.changeText(screen.getByTestId('field-email'), 'student@example.com');
		fireEvent.changeText(screen.getByTestId('field-password'), 'password123');
		fireEvent.press(screen.getByRole('button', { name: 'Войти' }));

		await waitFor(() => {
			expect(mockLogin).toHaveBeenCalledWith({
				email: 'student@example.com',
				password: 'password123',
			});
		});
		expect(mockReplace).toHaveBeenCalledWith('/');
	});

	it('shows backend error when login fails', async () => {
		mockLogin.mockResolvedValue({ success: false, error: 'Неверный логин или пароль' });
		render(<LoginForm />);

		fireEvent.changeText(screen.getByTestId('field-email'), 'student@example.com');
		fireEvent.changeText(screen.getByTestId('field-password'), 'password123');
		fireEvent.press(screen.getByRole('button', { name: 'Войти' }));

		await waitFor(() => {
			expect(screen.getByText('Неверный логин или пароль')).toBeTruthy();
		});
		expect(mockReplace).not.toHaveBeenCalled();
	});

	it('opens registration flow and forgot-password modal', async () => {
		render(<LoginForm />);

		fireEvent.press(screen.getByRole('button', { name: 'Регистрация' }));
		expect(mockPush).toHaveBeenCalledWith('/registration');

		fireEvent.press(screen.getByText('Не помню пароль'));
		expect(screen.getByText('forgot-password-modal')).toBeTruthy();
	});
});
