import { useState } from 'react';

import { MIN_REFERRAL_REWARD_BALANCE } from '../model/referral-program.constants';

import { useReferralRewardRequestMutation } from './useReferralRewardRequestMutation';

interface IUseReferralRewardRequestFlowParams {
	studentId?: string | null;
	balance: number;
	isPaymentInformationComplete: boolean;
}

export function useReferralRewardRequestFlow({
	studentId,
	balance,
	isPaymentInformationComplete,
}: IUseReferralRewardRequestFlowParams) {
	const rewardRequestMutation = useReferralRewardRequestMutation();
	const [isSuccessVisible, setIsSuccessVisible] = useState(false);
	const [isPaymentInfoVisible, setIsPaymentInfoVisible] = useState(false);
	const [isLowBalanceVisible, setIsLowBalanceVisible] = useState(false);
	const [rewardErrorText, setRewardErrorText] = useState<string | null>(null);

	const handleRewardPress = async () => {
		if (rewardRequestMutation.isPending) {
			return;
		}

		setRewardErrorText(null);

		if (!isPaymentInformationComplete) {
			setIsLowBalanceVisible(false);
			setIsPaymentInfoVisible(true);
			return;
		}

		if (balance < MIN_REFERRAL_REWARD_BALANCE) {
			setIsPaymentInfoVisible(false);
			setIsLowBalanceVisible(true);
			return;
		}

		if (!studentId) {
			setIsPaymentInfoVisible(false);
			setIsLowBalanceVisible(false);
			setRewardErrorText('Не удалось определить пользователя. Попробуйте позже.');
			return;
		}

		try {
			await rewardRequestMutation.mutateAsync({ userId: studentId });
			setIsPaymentInfoVisible(false);
			setIsLowBalanceVisible(false);
			setIsSuccessVisible(true);
		} catch {
			setIsPaymentInfoVisible(false);
			setIsLowBalanceVisible(false);
			setRewardErrorText('Не удалось отправить заявку на выплату. Попробуйте ещё раз.');
		}
	};

	return {
		handleRewardPress,
		isSubmitting: rewardRequestMutation.isPending,
		isSuccessVisible,
		isPaymentInfoVisible,
		isLowBalanceVisible,
		rewardErrorText,
		closeSuccessModal: () => setIsSuccessVisible(false),
		closePaymentInfoModal: () => setIsPaymentInfoVisible(false),
		closeLowBalanceModal: () => setIsLowBalanceVisible(false),
		clearRewardError: () => setRewardErrorText(null),
	};
}
