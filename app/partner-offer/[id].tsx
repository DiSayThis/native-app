import { useLocalSearchParams } from 'expo-router';

import PartnerOfferPageView from '@/pages/public-pages/PartnerOfferPage';

export default function PartnerOfferPage() {
	const { id } = useLocalSearchParams<{ id?: string | string[] }>();
	const partnerId = Array.isArray(id) ? id[0] : id;

	return <PartnerOfferPageView partnerId={partnerId} />;
}
