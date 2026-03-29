import { useMemo } from 'react';

import { StyleSheet, View } from 'react-native';

import { type AppTheme } from '@/shared/styles/tokens';
import GradientBackHeaderLayout from '@/shared/ui/GradientBackHeaderLayout';
import MarkdownText from '@/shared/ui/MarkdownText';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

import { USER_AGREEMENT_TEXT } from './legal-documents-content';

export default function CookiesPolicyPage() {
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);

	return (
		<GradientBackHeaderLayout title="Пользовательское соглашение">
			<View style={styles.content}>
				<MarkdownText content={USER_AGREEMENT_TEXT} />
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
