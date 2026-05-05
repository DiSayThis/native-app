import { useMemo } from 'react';

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useAtomValue } from 'jotai';

import { SupportRequestForm } from '@/features/support-request/ui/SupportRequestForm';

import { authAtom } from '@/entities/auth/model/auth.store';
import { useUserProfile } from '@/entities/user/hook/useUserProfile';

import { type AppTheme } from '@/shared/styles/tokens';
import GradientBackHeaderLayout from '@/shared/ui/GradientBackHeaderLayout';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

export default function SupportFormPage() {
	const { id: studentId } = useAtomValue(authAtom);
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);
	const { profile, isLoading } = useUserProfile(studentId);
	const requesterName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ').trim();

	return (
		<GradientBackHeaderLayout title="Техническая поддержка">
			{!studentId ? <Text style={styles.subtitle}>Пользователь не авторизован</Text> : null}

			{studentId ? (
				<View style={styles.container}>
					{isLoading ? (
						<View style={styles.loaderContainer}>
							<ActivityIndicator size="small" color={theme.colors.accentColor} />
						</View>
					) : null}

					<SupportRequestForm requesterName={requesterName} requesterEmail={profile?.email} />
				</View>
			) : null}
		</GradientBackHeaderLayout>
	);
}

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
		container: {
			gap: 14,
			paddingBottom: 48,
		},
		subtitle: {
			fontFamily: theme.typography.fontFamily,
			fontSize: 16,
			color: theme.colors.labelColor,
		},
		loaderContainer: {
			paddingVertical: 12,
			alignItems: 'center',
		},
	});
