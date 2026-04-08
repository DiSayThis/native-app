import type { IUserProfilePaymentInformationDto } from '../model/user.dto';

export function isPaymentInformationComplete(
	paymentInformation?: IUserProfilePaymentInformationDto | null,
) {
	if (!paymentInformation) {
		return false;
	}

	return Boolean(
		Number.isFinite(paymentInformation.inn) &&
		paymentInformation.inn > 0 &&
		paymentInformation.bik?.trim() &&
		paymentInformation.accountNumber?.trim() &&
		paymentInformation.patronymic?.trim(),
	);
}
