import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Check } from 'lucide-react-native';

import { lightTheme } from '@/shared/styles/tokens';

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
					{checked ? <Check size={14} color={lightTheme.colors.textColor} /> : null}
				</View>
				<Text style={styles.content}>{children}</Text>
			</Pressable>
		</FormFieldShell>
	);
}

const styles = StyleSheet.create({
	label: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	disabled: {
		opacity: 0.6,
	},
	checkbox: {
		width: 20,
		height: 20,
		borderRadius: 4,
		borderWidth: 1,
		borderColor: lightTheme.colors.borderColor,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: lightTheme.colors.clearWhite,
	},
	checkboxChecked: {
		backgroundColor: lightTheme.colors.accentColor,
		borderColor: lightTheme.colors.accentColor,
	},
	content: {
		flex: 1,
		fontSize: 16,
		color: lightTheme.colors.textColor,
		fontFamily: lightTheme.typography.fontFamily,
	},
});
