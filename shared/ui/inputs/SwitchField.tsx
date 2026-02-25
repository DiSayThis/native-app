import { StyleSheet, Switch, Text, View } from 'react-native';

import { lightTheme } from '@/shared/styles/tokens';

import { FormFieldShell } from './FormFieldShell';

interface ISwitchFieldProps {
	label?: string;
	errorText?: string;
	value?: boolean;
	onChange?: (value: boolean) => void;
	disabled?: boolean;
}

export function SwitchField({
	label,
	errorText,
	value = false,
	onChange,
	disabled,
}: ISwitchFieldProps) {
	return (
		<FormFieldShell errorText={errorText}>
			<View style={styles.row}>
				{label ? <Text style={styles.label}>{label}</Text> : null}
				<Switch
					disabled={disabled}
					value={value}
					onValueChange={onChange}
					trackColor={{
						false: lightTheme.colors.hoverBgSecondary,
						true: lightTheme.colors.accentColor,
					}}
				/>
			</View>
		</FormFieldShell>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	label: {
		flex: 1,
		fontSize: 16,
		color: lightTheme.colors.textColor,
		fontFamily: lightTheme.typography.fontFamily,
	},
});
