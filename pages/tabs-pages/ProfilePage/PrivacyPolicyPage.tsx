import { useMemo } from 'react';

import { StyleSheet, View } from 'react-native';

import { type AppTheme } from '@/shared/styles/tokens';
import GradientBackHeaderLayout from '@/shared/ui/GradientBackHeaderLayout';
import MarkdownText from '@/shared/ui/MarkdownText';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

import { PRIVACY_POLICY_TEXT } from './legal-documents-content';

export default function PrivacyPolicyPage() {
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);

	return (
		<GradientBackHeaderLayout title="Политика конфиденциальности">
			<View style={styles.content}>
				<MarkdownText content={PRIVACY_POLICY_TEXT} />
			</View>
		</GradientBackHeaderLayout>
	);
}

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
		content: {
			paddingBottom: theme.spacing.x6,
		},
	});
