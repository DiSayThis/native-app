import { Pressable, Text, TextInput, View } from 'react-native';

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import {
	useCheckEmailDomains,
	useCourseQuery,
	useEmailCheck,
	useRegistrationMutation,
	useUniversityQuery,
} from '../../hook/useRegistrationQueries';

import RegistrationForm from './RegistrationForm';

jest.mock('axios', () => ({
	AxiosError: class AxiosError extends Error {},
}));

jest.mock('expo-router', () => ({
	router: {
		replace: jest.fn(),
	},
	Link: ({ children }: any) => {
		const { Text } = require('react-native');

		return <Text>{children}</Text>;
	},
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

	return function MockButton({ children, onPress, disabled }: any) {
		return (
			<Pressable accessibilityRole="button" onPress={onPress} disabled={disabled}>
				<Text>{children}</Text>
			</Pressable>
		);
	};
});

jest.mock('@/shared/ui/inputs', () => {
	const React = require('react');
	const { Pressable, Text, TextInput, View } = require('react-native');
	const { Controller, useController } = require('react-hook-form');

	const errorNode = (fieldState: { error?: { message?: string } }) =>
		fieldState.error?.message ? <Text>{fieldState.error.message}</Text> : null;

	return {
		RHFInput: ({ control, name, label, placeholder }: any) => (
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
						{errorNode(fieldState)}
					</View>
				)}
			/>
		),
		RHFPassword: ({ control, name, label, placeholder }: any) => (
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
						{errorNode(fieldState)}
					</View>
				)}
			/>
		),
		RHFDateInput: ({ control, name, label }: any) => (
			<Controller
				control={control}
				name={name}
				render={({ field, fieldState }) => (
					<View>
						<Text>{label ?? name}</Text>
						<TextInput
							testID={`field-${name}`}
							value={field.value == null ? '' : String(field.value)}
							onChangeText={field.onChange}
						/>
						{errorNode(fieldState)}
					</View>
				)}
			/>
		),
		RHFSelectAutocomplete: ({ control, name, label, options = [] }: any) => (
			<Controller
				control={control}
				name={name}
				render={({ field, fieldState }) => (
					<View>
						<Text>{label ?? name}</Text>
						<Pressable
							testID={`field-${name}`}
							onPress={() => {
								const nextValue = options[0]?.value ?? 1;
								field.onChange(nextValue);
							}}
						>
							<Text>
								{field.value == null || field.value === 0 ? 'empty' : String(field.value)}
							</Text>
						</Pressable>
						{errorNode(fieldState)}
					</View>
				)}
			/>
		),
		RHFFileInput: ({ control, name, label }: any) => {
			const { field, fieldState } = useController({ control, name });

			return (
				<View>
					<Text>{label ?? name}</Text>
					<Pressable
						testID={`field-${name}`}
						onPress={() =>
							field.onChange({
								uri: 'file://student-card.png',
								name: 'student-card.png',
								mimeType: 'image/png',
							})
						}
					>
						<Text>{field.value?.name ?? 'empty'}</Text>
					</Pressable>
					{errorNode(fieldState)}
				</View>
			);
		},
		RHFCheckbox: ({ control, name, children }: any) => (
			<Controller
				control={control}
				name={name}
				render={({ field, fieldState }) => (
					<View>
						<Pressable testID={`field-${name}`} onPress={() => field.onChange(!field.value)}>
							<Text>{children}</Text>
						</Pressable>
						<Text>{field.value ? 'checked' : 'unchecked'}</Text>
						{errorNode(fieldState)}
					</View>
				)}
			/>
		),
	};
});

jest.mock('../../hook/useRegistrationQueries', () => ({
	useEmailCheck: jest.fn(),
	useUniversityQuery: jest.fn(),
	useCourseQuery: jest.fn(),
	useCheckEmailDomains: jest.fn(),
	useRegistrationMutation: jest.fn(),
}));

const mockedUseEmailCheck = jest.mocked(useEmailCheck);
const mockedUseUniversityQuery = jest.mocked(useUniversityQuery);
const mockedUseCourseQuery = jest.mocked(useCourseQuery);
const mockedUseCheckEmailDomains = jest.mocked(useCheckEmailDomains);
const mockedUseRegistrationMutation = jest.mocked(useRegistrationMutation);

describe('RegistrationForm', () => {
	const refetch = jest.fn();
	const checkEmailDomains = jest.fn();
	const registration = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();

		refetch.mockResolvedValue({ data: null });
		checkEmailDomains.mockResolvedValue(true);
		registration.mockResolvedValue(undefined);

		mockedUseEmailCheck.mockReturnValue({
			refetch,
			isFetching: false,
		} as any);
		mockedUseUniversityQuery.mockReturnValue({
			data: [{ id: 10, name: 'University' }],
			isLoading: false,
		} as any);
		mockedUseCourseQuery.mockReturnValue({
			data: [{ id: 20, name: 'Course' }],
			isLoading: false,
		} as any);
		mockedUseCheckEmailDomains.mockReturnValue({
			mutateAsync: checkEmailDomains,
			isPending: false,
		} as any);
		mockedUseRegistrationMutation.mockReturnValue({
			mutateAsync: registration,
			isPending: false,
		} as any);
	});

	const fillStep1 = () => {
		fireEvent.changeText(screen.getByTestId('field-email'), 'student@example.com');
		fireEvent.changeText(screen.getByTestId('field-password'), 'Password1!');
		fireEvent.changeText(screen.getByTestId('field-confirmPassword'), 'Password1!');
	};

	const fillStep2 = () => {
		fireEvent.changeText(screen.getByTestId('field-firstName'), 'Иван');
		fireEvent.changeText(screen.getByTestId('field-lastName'), 'Иванов');
		fireEvent.press(screen.getByTestId('field-sex'));
		fireEvent.changeText(screen.getByTestId('field-birthDate'), '2001-05-20');
	};

	const fillStep3 = () => {
		fireEvent.press(screen.getByTestId('field-universityId'));
		fireEvent.changeText(screen.getByTestId('field-specialisation'), 'Математика');
		fireEvent.press(screen.getByTestId('field-courseId'));
		fireEvent.press(screen.getByTestId('field-consent'));
	};

	it('moves to the next step after a valid first step and unique email', async () => {
		render(<RegistrationForm />);

		fillStep1();
		fireEvent.press(screen.getByRole('button', { name: 'Далее' }));

		await waitFor(() => expect(refetch).toHaveBeenCalled());
		await waitFor(() => expect(screen.getByTestId('field-firstName')).toBeTruthy());
	});

	it('shows duplicate email error and stays on step 1', async () => {
		refetch.mockResolvedValue({ data: { id: 'existing-user' } });
		render(<RegistrationForm />);

		fillStep1();
		fireEvent.press(screen.getByRole('button', { name: 'Далее' }));

		await waitFor(() => {
			expect(screen.getByText('Пользователь с таким email уже зарегистрирован')).toBeTruthy();
		});
		expect(screen.queryByTestId('field-firstName')).toBeNull();
	});

	it('requires a file when email domain check fails', async () => {
		checkEmailDomains.mockResolvedValue(false);
		render(<RegistrationForm />);

		fillStep1();
		fireEvent.press(screen.getByRole('button', { name: 'Далее' }));
		await waitFor(() => expect(screen.getByTestId('field-firstName')).toBeTruthy());

		fillStep2();
		fireEvent.press(screen.getByRole('button', { name: 'Далее' }));
		await waitFor(() => expect(screen.getByTestId('field-universityId')).toBeTruthy());

		fillStep3();
		fireEvent.press(screen.getByRole('button', { name: 'Завершить' }));

		await waitFor(() => {
			expect(checkEmailDomains).toHaveBeenCalledWith({
				email: 'student@example.com',
				universityId: 10,
			});
		});
		await waitFor(() => expect(screen.getByText('Файл обязателен')).toBeTruthy());
		expect(registration).not.toHaveBeenCalled();
	});

	it('submits registration data and shows success modal', async () => {
		jest.useFakeTimers();

		render(<RegistrationForm />);

		fillStep1();
		fireEvent.press(screen.getByRole('button', { name: 'Далее' }));
		await waitFor(() => expect(screen.getByTestId('field-firstName')).toBeTruthy());

		fillStep2();
		fireEvent.press(screen.getByRole('button', { name: 'Далее' }));
		await waitFor(() => expect(screen.getByTestId('field-universityId')).toBeTruthy());

		fillStep3();
		fireEvent.press(screen.getByRole('button', { name: 'Завершить' }));

		await waitFor(() => {
			expect(registration).toHaveBeenCalledWith(
				expect.objectContaining({
					email: 'student@example.com',
					password: 'Password1!',
					firstName: 'Иван',
					lastName: 'Иванов',
					universityId: 10,
					courseId: 20,
					specialisation: 'Математика',
					consent: true,
				}),
			);
		});

		expect(screen.getByText('Благодарим за регистрацию!')).toBeTruthy();

		act(() => {
			jest.runOnlyPendingTimers();
		});

		jest.useRealTimers();
	});
});
