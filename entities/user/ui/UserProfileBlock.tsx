import { useEffect, useMemo, useState } from 'react';

import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

import { FILE_API } from '@/shared/api/urls';
import { lightTheme } from '@/shared/styles/tokens';
import Button from '@/shared/ui/Button';

type UserProfileBlockProps = {
	studentId: string;
	firstName?: string;
	lastName?: string;
	isLoading: boolean;
	isError: boolean;
	onRetry: () => void;
};

export function UserProfileBlock({
	studentId,
	firstName,
	lastName,
	isLoading,
	isError,
	onRetry,
}: UserProfileBlockProps) {
	const [hasAvatarError, setHasAvatarError] = useState(false);

	useEffect(() => {
		setHasAvatarError(false);
	}, [studentId]);

	const fullName = useMemo(() => {
		const rawName = [firstName, lastName].filter(Boolean).join(' ').trim();
		return rawName || 'Пользователь';
	}, [firstName, lastName]);

	const initials = useMemo(() => {
		const [first = '', last = ''] = [firstName ?? '', lastName ?? ''];
		const computed = `${first[0] ?? ''}${last[0] ?? ''}`.trim().toUpperCase();
		return computed || 'U';
	}, [firstName, lastName]);

	const avatarUri = `${FILE_API}/Avatars/${studentId}`;
	const showAvatarImage = !hasAvatarError;

	return (
		<View style={styles.profileBlock}>
			<View style={styles.avatarCircle}>
				{showAvatarImage ? (
					<Image
						source={{ uri: avatarUri }}
						style={styles.avatarImage}
						onError={() => setHasAvatarError(true)}
					/>
				) : (
					<Text style={styles.avatarFallbackText}>{initials}</Text>
				)}
			</View>

			{isLoading ? (
				<ActivityIndicator color={lightTheme.colors.accentColor} />
			) : (
				<Text style={styles.nameText}>{fullName}</Text>
			)}

			{isError ? (
				<View style={styles.retryButton}>
					<Button title="Повторить" variant="white" onPress={onRetry} />
				</View>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	profileBlock: {
		alignItems: 'center',
	},
	avatarCircle: {
		width: 100,
		height: 100,
		borderRadius: 66,
		overflow: 'hidden',
		backgroundColor: lightTheme.colors.bgSecondary,
		borderWidth: 1,
		borderColor: lightTheme.colors.borderColor,
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatarImage: {
		width: '100%',
		height: '100%',
	},
	avatarFallbackText: {
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: 42,
		fontWeight: 700,
		color: lightTheme.colors.textColor,
	},
	nameText: {
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: 24,
		fontWeight: 700,
		color: lightTheme.colors.textColor,
		textAlign: 'center',
	},
	retryButton: {
		width: '100%',
		maxWidth: 260,
	},
});
