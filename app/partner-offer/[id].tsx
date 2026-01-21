import { Text, View } from 'react-native';

import { useLocalSearchParams } from 'expo-router';

export default function PartnerOfferPage() {
	const { id } = useLocalSearchParams();
	return (
		<View>
			<Text>Страница партнера {id}</Text>
		</View>
	);
}
