import { useEffect, useMemo, useState } from 'react';

import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

import { useAtomValue } from 'jotai';

import { buildUserAvatarUri } from '@/entities/user/lib/buildUserAvatarUri';
import { userAvatarVersionAtom } from '@/entities/user/model/user.store';

import { type AppTheme } from '@/shared/styles/tokens';
import Button from '@/shared/ui/Button';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

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
	const avatarVersions = useAtomValue(userAvatarVersionAtom);
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);
	const avatarVersion = avatarVersions[studentId] ?? 0;

	useEffect(() => {
		setHasAvatarError(false);
	}, [studentId, avatarVersion]);

	const fullName = useMemo(() => {
		const rawName = [firstName, lastName].filter(Boolean).join(' ').trim();
		return rawName || 'Пользователь';
	}, [firstName, lastName]);

	const initials = useMemo(() => {
		const [first = '', last = ''] = [firstName ?? '', lastName ?? ''];
		const computed = `${first[0] ?? ''}${last[0] ?? ''}`.trim().toUpperCase();
		return computed || 'U';
	}, [firstName, lastName]);

	const avatarUri = buildUserAvatarUri(studentId, avatarVersion);
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
				<ActivityIndicator color={theme.colors.accentColor} />
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

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
		profileBlock: {
			alignItems: 'center',
		},
		avatarCircle: {
			width: 100,
			height: 100,
			borderRadius: 66,
			overflow: 'hidden',
			backgroundColor: theme.colors.bgSecondary,
			borderWidth: 1,
			borderColor: theme.colors.borderColor,
			alignItems: 'center',
			justifyContent: 'center',
		},
		avatarImage: {
			width: '100%',
			height: '100%',
		},
		avatarFallbackText: {
			fontFamily: theme.typography.fontFamilyHeadings,
			fontSize: 42,
			fontWeight: 700,
			color: theme.colors.textColor,
		},
		nameText: {
			fontFamily: theme.typography.fontFamilyHeadings,
			fontSize: 24,
			fontWeight: 700,
			color: theme.colors.textColor,
			textAlign: 'center',
		},
		retryButton: {
			width: '100%',
			maxWidth: 260,
		},
	});
