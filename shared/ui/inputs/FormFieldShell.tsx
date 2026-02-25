import { StyleSheet, Text, View } from 'react-native';

import { lightTheme } from '@/shared/styles/tokens';

interface IFormFieldShellProps {
	label?: string;
	errorText?: string;
	children: React.ReactNode;
}

export function FormFieldShell({ label, errorText, children }: IFormFieldShellProps) {
	return (
		<View style={styles.wrapper}>
			{label ? <Text style={styles.label}>{label}</Text> : null}
			{children}
			{errorText ? <Text style={styles.error}>{errorText}</Text> : null}
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		gap: 6,
	},
	label: {
		fontSize: 14,
		color: lightTheme.colors.labelColor,
		fontFamily: lightTheme.typography.fontFamily,
	},
	error: {
		fontSize: 14,
		color: lightTheme.colors.error,
		fontFamily: lightTheme.typography.fontFamily,
	},
});
