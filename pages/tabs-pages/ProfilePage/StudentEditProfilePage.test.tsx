import { Pressable, Text, TextInput, View } from 'react-native';

import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { useCityRegionQuery } from '@/entities/city-region/hook/useCityRegionQuery';
import { useUserProfile } from '@/entities/user/hook/useUserProfile';
import { useUserProfileFormDictionaries } from '@/entities/user/hook/useUserProfileFormDictionaries';
import { useUserProfileMutations } from '@/entities/user/hook/useUserProfileMutations';

import StudentEditProfilePage from './StudentEditProfilePage';

let mockAuthState = { id: 'student-1' };

jest.mock('axios', () => ({
	__esModule: true,
	AxiosError: class AxiosError extends Error {},
	default: {
		create: jest.fn(() => ({})),
	},
}));

jest.mock('@/entities/auth/model/auth.store', () => ({
	authAtom: Symbol('authAtom'),
}));

jest.mock('jotai', () => {
	const actual = jest.requireActual('jotai');
	const { authAtom } = require('@/entities/auth/model/auth.store');

	return {
		...actual,
		useAtomValue: (atom: unknown) => {
			if (atom === authAtom) {
				return mockAuthState;
			}

			if (typeof atom === 'object' && atom !== null) {
				return {};
			}

			return actual.useAtomValue(atom);
		},
		useSetAtom: () => jest.fn(),
	};
});

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

jest.mock('@/shared/ui/GradientBackHeaderLayout', () => {
	const React = require('react');
	const { Text, View } = require('react-native');

	return function MockLayout({ title, children }: any) {
		return (
			<View>
				<Text>{title}</Text>
				{children}
			</View>
		);
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
	const { Controller } = require('react-hook-form');

	const errorNode = (fieldState: { error?: { message?: string } }) =>
		fieldState.error?.message ? <Text>{fieldState.error.message}</Text> : null;

	const InputLike = ({ control, name, label, placeholder }: any) => (
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
					/>
					{errorNode(fieldState)}
				</View>
			)}
		/>
	);

	return {
		RHFInput: InputLike,
		RHFDateInput: InputLike,
		RHFSelect: ({ control, name, label }: any) => (
			<Controller
				control={control}
				name={name}
				render={({ field, fieldState }) => (
					<View>
						<Text>{label ?? name}</Text>
						<Pressable testID={`field-${name}`} onPress={() => field.onChange(field.value)}>
							<Text>{String(field.value)}</Text>
						</Pressable>
						{errorNode(fieldState)}
					</View>
				)}
			/>
		),
		RHFSelectAutocomplete: ({ control, name, label }: any) => (
			<Controller
				control={control}
				name={name}
				render={({ field, fieldState }) => (
					<View>
						<Text>{label ?? name}</Text>
						<Pressable testID={`field-${name}`} onPress={() => field.onChange(field.value)}>
							<Text>{String(field.value)}</Text>
						</Pressable>
						{errorNode(fieldState)}
					</View>
				)}
			/>
		),
	};
});

jest.mock('@/entities/user/hook/useUserProfile', () => ({
	useUserProfile: jest.fn(),
}));

jest.mock('@/entities/user/hook/useUserProfileMutations', () => ({
	useUserProfileMutations: jest.fn(),
}));

jest.mock('@/entities/user/hook/useUserProfileFormDictionaries', () => ({
	useUserProfileFormDictionaries: jest.fn(),
}));

jest.mock('@/entities/city-region/hook/useCityRegionQuery', () => ({
	useCityRegionQuery: jest.fn(),
}));

jest.mock('@/shared/lib/file-to-base64', () => ({
	documentPickerAssetToBase64: jest.fn(),
}));

const mockedUseUserProfile = jest.mocked(useUserProfile);
const mockedUseUserProfileMutations = jest.mocked(useUserProfileMutations);
const mockedUseUserProfileFormDictionaries = jest.mocked(useUserProfileFormDictionaries);
const mockedUseCityRegionQuery = jest.mocked(useCityRegionQuery);

describe('StudentEditProfilePage', () => {
	const refetch = jest.fn();
	const updateProfile = { mutateAsync: jest.fn(), isPending: false };
	const uploadAvatar = { mutateAsync: jest.fn(), isPending: false };

	beforeEach(() => {
		jest.clearAllMocks();
		mockAuthState = { id: 'student-1' };

		mockedUseUserProfile.mockReturnValue({
			profile: {
				id: 'student-1',
				email: 'student@example.com',
				firstName: 'Ivan',
				lastName: 'Ivanov',
				birthDate: '2001-05-20T00:00:00',
				sex: true,
				status: 1,
				hasWork: true,
				specialisation: 'Math',
				university: { id: 10, name: 'University' },
				course: { id: 20, name: 'Course' },
				region: { id: 30, name: 'Region' },
				city: { id: 40, name: 'City' },
				balance: 100,
				languages: [{ id: 50, name: 'English' }],
				paymentInformation: null,
			},
			isLoading: false,
			isError: false,
			refetch,
		} as any);
		mockedUseUserProfileMutations.mockReturnValue({
			updateProfile,
			uploadAvatar,
		} as any);
		mockedUseCityRegionQuery.mockReturnValue({
			regions: [{ id: 30, name: 'Region' }],
			isLoading: false,
		} as any);
		mockedUseUserProfileFormDictionaries.mockReturnValue({
			universitiesQuery: { data: [{ id: 10, name: 'University' }], isLoading: false },
			coursesQuery: { data: [{ id: 20, name: 'Course' }], isLoading: false },
			citiesQuery: { data: [{ id: 40, name: 'City' }], isLoading: false, isSuccess: true },
		} as any);
		updateProfile.mutateAsync.mockResolvedValue(undefined);
		uploadAvatar.mutateAsync.mockResolvedValue(undefined);
	});

	it('shows retry state when profile loading failed', () => {
		mockedUseUserProfile.mockReturnValue({
			profile: null,
			isLoading: false,
			isError: true,
			refetch,
		} as any);

		render(<StudentEditProfilePage />);

		fireEvent.press(screen.getByRole('button', { name: 'Повторить' }));

		expect(refetch).toHaveBeenCalled();
	});

	it('submits normalized profile payload', async () => {
		render(<StudentEditProfilePage />);

		fireEvent.changeText(screen.getByTestId('field-firstName'), ' Ivan ');
		fireEvent.changeText(screen.getByTestId('field-lastName'), ' Ivanov ');
		fireEvent.changeText(screen.getByTestId('field-specialisation'), ' Physics ');
		fireEvent.changeText(screen.getByTestId('field-birthDate'), '2001-05-20');
		fireEvent.press(screen.getByRole('button', { name: 'Сохранить изменения' }));

		await waitFor(() => {
			expect(updateProfile.mutateAsync).toHaveBeenCalledWith({
				id: 'student-1',
				firstName: 'Ivan',
				lastName: 'Ivanov',
				sex: true,
				birthDate: '2001-05-20',
				email: 'student@example.com',
				specialisation: 'Physics',
				status: 1,
				universityId: 10,
				regionId: 30,
				balance: 100,
				hasWork: true,
				cityId: 40,
				languageIds: [50],
				courseId: 20,
				paymentInformation: null,
			});
		});

		expect(screen.getByText('Профиль успешно сохранен')).toBeTruthy();
	});
});
