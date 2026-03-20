import { StyleSheet, Text, View } from 'react-native';

import { useAtomValue, useSetAtom } from 'jotai';

import { authAtom, logoutAtom } from '@/entities/auth/model/auth.store';
import { useUserProfile } from '@/entities/user/hook/useUserProfile';
import { UserProfileBlock } from '@/entities/user/ui/UserProfileBlock';

import { lightTheme } from '@/shared/styles/tokens';
import Button from '@/shared/ui/Button';

export default function ProfilePage() {
	const { id: studentId } = useAtomValue(authAtom);
	const logout = useSetAtom(logoutAtom);
	const { profile, isLoading, isError, refetch } = useUserProfile(studentId);

	if (!studentId) {
		return (
			<View style={[styles.container, styles.centered]}>
				<Text style={styles.nameText}>Пользователь не авторизован</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<UserProfileBlock
				studentId={studentId}
				firstName={profile?.firstName}
				lastName={profile?.lastName}
				isLoading={isLoading}
				isError={isError}
				onRetry={() => void refetch()}
			/>

			<Button onPress={logout}>Выйти</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: lightTheme.spacing.x4,
		backgroundColor: lightTheme.colors.background,
	},
	centered: {
		justifyContent: 'center',
	},
	nameText: {
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: 28,
		fontWeight: 700,
		color: lightTheme.colors.textColor,
		textAlign: 'center',
	},
});
