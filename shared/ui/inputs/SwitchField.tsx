import { useMemo } from 'react';

import { StyleSheet, Switch, Text, View } from 'react-native';

import { type AppTheme } from '@/shared/styles/tokens';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

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
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);

	return (
		<FormFieldShell errorText={errorText}>
			<View style={styles.row}>
				{label ? <Text style={styles.label}>{label}</Text> : null}
				<Switch
					disabled={disabled}
					value={value}
					onValueChange={onChange}
					trackColor={{
						false: theme.colors.hoverBgSecondary,
						true: theme.colors.accentColor,
					}}
				/>
			</View>
		</FormFieldShell>
	);
}

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
		row: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
		},
		label: {
			flex: 1,
			fontSize: 16,
			color: theme.colors.textColor,
			fontFamily: theme.typography.fontFamily,
		},
	});
