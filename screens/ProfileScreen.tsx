import { StyleSheet, Text, View } from 'react-native';

import { useAtom, useSetAtom } from 'jotai';

import { loginAtom, logoutAtom } from '@/entities/auth/model/auth.store';

import { lightTheme } from '@/shared/styles/tokens';
import Button from '@/shared/ui/Button';

export default function ProfileScreen() {
	const [auth, login] = useAtom(loginAtom);
	const logout = useSetAtom(logoutAtom);

	return (
		<View style={styles.container}>
			<Text style={{ fontFamily: lightTheme.typography.fontFamilyHeadings }}>id: {auth.id}</Text>
			<Button onPress={() => login({ email: 'disaythis@gmail.com', password: '21Pingvin!' })}>
				Войти
			</Button>
			<Button onPress={logout}>Выйти</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: lightTheme.spacing.x2,
	},
});
