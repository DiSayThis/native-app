import { useMemo } from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Check } from 'lucide-react-native';

import { type AppTheme } from '@/shared/styles/tokens';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

import { FormFieldShell } from './FormFieldShell';

export interface ICheckboxBaseProps {
	children: React.ReactNode;
	errorText?: string;
	checked?: boolean;
	disabled?: boolean;
	onChange?: (value: boolean) => void;
	custom?: boolean;
}

export default function CheckboxInputBase({
	children,
	errorText,
	checked = false,
	disabled = false,
	onChange,
}: ICheckboxBaseProps) {
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);

	return (
		<FormFieldShell errorText={errorText}>
			<Pressable
				style={[styles.label, disabled ? styles.disabled : null]}
				onPress={() => {
					if (!disabled) onChange?.(!checked);
				}}
				accessibilityRole="checkbox"
				accessibilityState={{ checked, disabled }}
			>
				<View style={[styles.checkbox, checked ? styles.checkboxChecked : null]}>
					{checked ? <Check size={24} color={theme.colors.textColor} /> : null}
				</View>
				<Text style={styles.content}>{children}</Text>
			</Pressable>
		</FormFieldShell>
	);
}

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
		label: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: 10,
		},
		disabled: {
			opacity: 0.6,
		},
		checkbox: {
			width: 30,
			height: 30,
			borderRadius: 4,
			borderWidth: 1,
			borderColor: theme.colors.borderColor,
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: theme.colors.clearWhite,
		},
		checkboxChecked: {
			backgroundColor: theme.colors.accentColor,
			borderColor: theme.colors.accentColor,
		},
		content: {
			flex: 1,
			fontSize: 16,
			color: theme.colors.textColor,
			fontFamily: theme.typography.fontFamily,
		},
	});
