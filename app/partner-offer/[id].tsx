import { Text } from 'react-native';

import { useLocalSearchParams } from 'expo-router';

export default function PartnerOfferPage() {
	const { id } = useLocalSearchParams();
	return (
		<>
			<Text>Страница партнера {id}</Text>
		</>
	);
}
