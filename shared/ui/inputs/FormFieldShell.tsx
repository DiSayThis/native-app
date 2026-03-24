import { useMemo } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { type AppTheme } from '@/shared/styles/tokens';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

interface IFormFieldShellProps {
	label?: string;
	errorText?: string;
	children: React.ReactNode;
}

export function FormFieldShell({ label, errorText, children }: IFormFieldShellProps) {
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);

	return (
		<View style={styles.wrapper}>
			{label ? <Text style={styles.label}>{label}</Text> : null}
			{children}
			{errorText ? <Text style={styles.error}>{errorText}</Text> : null}
		</View>
	);
}

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
		wrapper: {
			gap: 6,
		},
		label: {
			fontSize: 14,
			color: theme.colors.labelColor,
			fontFamily: theme.typography.fontFamily,
		},
		error: {
			fontSize: 14,
			color: theme.colors.error,
			fontFamily: theme.typography.fontFamily,
		},
	});
