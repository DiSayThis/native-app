import { useMemo } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { type AppTheme } from '@/shared/styles/tokens';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

export default function WalletPage() {
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Кошелек</Text>
		</View>
	);
}

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
		container: {
			flex: 1,
			padding: theme.spacing.x2,
			backgroundColor: theme.colors.background,
		},
		title: {
			fontFamily: theme.typography.fontFamilyHeadings,
			fontSize: theme.typography.fontSizeHeading,
			color: theme.colors.textColor,
		},
	});
