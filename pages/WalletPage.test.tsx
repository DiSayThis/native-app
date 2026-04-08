import { Text, View } from 'react-native';

import { fireEvent, render, screen } from '@testing-library/react-native';

import { useReferralRewardRequestFlow } from '@/features/referral-program/hook/useReferralRewardRequestFlow';

import { useUserProfile } from '@/entities/user/hook/useUserProfile';

import WalletPage from './WalletPage';

const mockPush = jest.fn();
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

jest.mock('expo-router', () => ({
	useRouter: () => ({
		push: mockPush,
	}),
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

			return actual.useAtomValue(atom);
		},
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

jest.mock('@/shared/ui/ModalSlide', () => {
	const React = require('react');
	const { View } = require('react-native');

	return function MockModalSlide({ visible, children }: any) {
		return visible ? <View>{children}</View> : null;
	};
});

jest.mock('@/features/referral-program/ui/ReferralInviteModal', () => {
	const React = require('react');
	const { Text, View } = require('react-native');

	return {
		ReferralInviteModal: ({ visible, referralLink, referralPromocode }: any) =>
			visible ? (
				<View>
					<Text>{`invite:${referralLink}:${referralPromocode}`}</Text>
				</View>
			) : null,
	};
});

jest.mock('@/entities/user/hook/useUserProfile', () => ({
	useUserProfile: jest.fn(),
}));

jest.mock('@/features/referral-program/hook/useReferralRewardRequestFlow', () => ({
	useReferralRewardRequestFlow: jest.fn(),
}));

const mockedUseUserProfile = jest.mocked(useUserProfile);
const mockedUseReferralRewardRequestFlow = jest.mocked(useReferralRewardRequestFlow);

describe('WalletPage', () => {
	const flowState = {
		handleRewardPress: jest.fn(),
		isSubmitting: false,
		isSuccessVisible: false,
		isPaymentInfoVisible: false,
		isLowBalanceVisible: false,
		rewardErrorText: null,
		closeSuccessModal: jest.fn(),
		closePaymentInfoModal: jest.fn(),
		closeLowBalanceModal: jest.fn(),
		clearRewardError: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
		mockAuthState = { id: 'student-1' };

		mockedUseUserProfile.mockReturnValue({
			profile: {
				balance: 1500,
				promocode: 'PROMO',
				paymentInformation: null,
			},
		} as any);
		mockedUseReferralRewardRequestFlow.mockReturnValue(flowState as any);
	});

	it('shows balance, payment warning and opens invite modal', () => {
		render(<WalletPage />);

		expect(screen.getByText('1500 ₽')).toBeTruthy();
		expect(screen.getAllByText(/реквизиты/i).length).toBeGreaterThan(0);

		fireEvent.press(screen.getByText('Пригласить друзей'));

		expect(
			screen.getByText(/invite:https:\/\/.*\/registration\?promocode=PROMO:PROMO/),
		).toBeTruthy();
	});

	it('navigates to credentials and triggers reward request', () => {
		render(<WalletPage />);

		fireEvent.press(screen.getByText('Банковские реквизиты'));
		fireEvent.press(screen.getByText('Получить вознаграждение'));

		expect(mockPush).toHaveBeenCalledWith('/student-credentials');
		expect(flowState.handleRewardPress).toHaveBeenCalled();
	});

	it('renders payment info modal CTA and error state from the reward flow', () => {
		mockedUseReferralRewardRequestFlow.mockReturnValue({
			...flowState,
			isPaymentInfoVisible: true,
			rewardErrorText: 'Ошибка выплаты',
		} as any);

		render(<WalletPage />);

		expect(screen.getByText('Ошибка выплаты')).toBeTruthy();
		fireEvent.press(screen.getByRole('button', { name: 'Перейти к реквизитам' }));

		expect(flowState.closePaymentInfoModal).toHaveBeenCalled();
		expect(mockPush).toHaveBeenCalledWith('/student-credentials');
	});
});
