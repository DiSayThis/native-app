import { act, renderHook } from '@testing-library/react-native';

import { MIN_REFERRAL_REWARD_BALANCE } from '../model/referral-program.constants';

import { useReferralRewardRequestFlow } from './useReferralRewardRequestFlow';
import { useReferralRewardRequestMutation } from './useReferralRewardRequestMutation';

jest.mock('./useReferralRewardRequestMutation', () => ({
	useReferralRewardRequestMutation: jest.fn(),
}));

const mockedUseReferralRewardRequestMutation = jest.mocked(useReferralRewardRequestMutation);

describe('useReferralRewardRequestFlow', () => {
	const mutateAsync = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		mockedUseReferralRewardRequestMutation.mockReturnValue({
			mutateAsync,
			isPending: false,
		} as any);
	});

	it('opens payment info modal when payment data is missing', async () => {
		const { result } = renderHook(() =>
			useReferralRewardRequestFlow({
				studentId: 'student-1',
				balance: MIN_REFERRAL_REWARD_BALANCE,
				isPaymentInformationComplete: false,
			}),
		);

		await act(async () => {
			await result.current.handleRewardPress();
		});

		expect(result.current.isPaymentInfoVisible).toBe(true);
		expect(result.current.isLowBalanceVisible).toBe(false);
		expect(mutateAsync).not.toHaveBeenCalled();
	});

	it('opens low balance modal when reward threshold is not met', async () => {
		const { result } = renderHook(() =>
			useReferralRewardRequestFlow({
				studentId: 'student-1',
				balance: MIN_REFERRAL_REWARD_BALANCE - 1,
				isPaymentInformationComplete: true,
			}),
		);

		await act(async () => {
			await result.current.handleRewardPress();
		});

		expect(result.current.isLowBalanceVisible).toBe(true);
		expect(result.current.isPaymentInfoVisible).toBe(false);
		expect(mutateAsync).not.toHaveBeenCalled();
	});

	it('shows an error when student id is missing', async () => {
		const { result } = renderHook(() =>
			useReferralRewardRequestFlow({
				studentId: null,
				balance: MIN_REFERRAL_REWARD_BALANCE,
				isPaymentInformationComplete: true,
			}),
		);

		await act(async () => {
			await result.current.handleRewardPress();
		});

		expect(result.current.rewardErrorText).toBeTruthy();
		expect(result.current.isSuccessVisible).toBe(false);
		expect(mutateAsync).not.toHaveBeenCalled();
	});

	it('shows success modal after a successful request', async () => {
		mutateAsync.mockResolvedValue(undefined);

		const { result } = renderHook(() =>
			useReferralRewardRequestFlow({
				studentId: 'student-1',
				balance: MIN_REFERRAL_REWARD_BALANCE,
				isPaymentInformationComplete: true,
			}),
		);

		await act(async () => {
			await result.current.handleRewardPress();
		});

		expect(mutateAsync).toHaveBeenCalledWith({ userId: 'student-1' });
		expect(result.current.isSuccessVisible).toBe(true);
		expect(result.current.rewardErrorText).toBeNull();
	});

	it('shows a request error when the mutation fails', async () => {
		mutateAsync.mockRejectedValue(new Error('network'));

		const { result } = renderHook(() =>
			useReferralRewardRequestFlow({
				studentId: 'student-1',
				balance: MIN_REFERRAL_REWARD_BALANCE,
				isPaymentInformationComplete: true,
			}),
		);

		await act(async () => {
			await result.current.handleRewardPress();
		});

		expect(result.current.rewardErrorText).toBeTruthy();
		expect(result.current.isSuccessVisible).toBe(false);
	});
});
