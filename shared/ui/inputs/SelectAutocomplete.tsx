import { useMemo, useState } from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ChevronDown, X } from 'lucide-react-native';

import { type AppTheme } from '@/shared/styles/tokens';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

import { AutocompleteOptionsModal } from './AutocompleteOptionsModal';
import { FormFieldShell } from './FormFieldShell';
import type { SelectOption } from './types';

export type SelectAutocompleteProps = {
	value?: string | number | boolean;
	onChange: (value?: string | number | boolean) => void;
	options: SelectOption[];
	snapPoints?: Array<string | number>;
	initialSnapPoint?: number | `${number}%` | 'auto';
	label?: string;
	placeholder?: string;
	errorText?: string;
	showClearButton?: boolean;
	onClear?: () => void;
	searchable?: boolean;
	disabled?: boolean;
	noOptionsText?: string;
	onBlur?: () => void;
	isLoading?: boolean;
};

export function SelectAutocomplete({
	value,
	onChange,
	options,
	snapPoints,
	initialSnapPoint,
	label,
	placeholder = 'Выберите...',
	errorText,
	showClearButton = false,
	onClear,
	searchable = true,
	disabled = false,
	noOptionsText = 'Ничего не найдено',
	onBlur,
	isLoading = false,
}: SelectAutocompleteProps) {
	const [isOpen, setIsOpen] = useState(false);
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);

	const selectedOption = useMemo(
		() => options.find((option) => String(option.value) === String(value)),
		[options, value],
	);

	const handleClose = () => {
		setIsOpen(false);
		onBlur?.();
	};

	return (
		<FormFieldShell label={label} errorText={errorText}>
			<Pressable
				style={[
					styles.inputWrapper,
					!errorText && isOpen ? styles.focusedBorder : null,
					errorText ? styles.errorBorder : null,
					disabled ? styles.disabled : null,
				]}
				onPress={() => {
					if (!disabled) setIsOpen(true);
				}}
				disabled={disabled}
			>
				<Text
					style={[styles.valueText, !selectedOption ? styles.placeholder : null]}
					numberOfLines={1}
				>
					{selectedOption?.label ?? placeholder}
				</Text>
				<View style={styles.controls}>
					{showClearButton && selectedOption ? (
						<Pressable
							style={styles.iconButton}
							onPress={() => {
								onChange(undefined);
								onClear?.();
							}}
						>
							<X size={16} color={theme.colors.labelColor} />
						</Pressable>
					) : null}
					<ChevronDown size={16} color={theme.colors.labelColor} />
				</View>
			</Pressable>

			<AutocompleteOptionsModal
				visible={isOpen}
				onClose={handleClose}
				title={label ?? 'Выбор'}
				snapPoints={snapPoints}
				initialSnapPoint={initialSnapPoint}
				selectedValue={value}
				options={options}
				searchable={searchable}
				noOptionsText={noOptionsText}
				isLoading={isLoading}
				onSelect={(nextValue) => {
					onChange(nextValue);
				}}
			/>
		</FormFieldShell>
	);
}

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
		inputWrapper: {
			minHeight: 48,
			borderWidth: 1,
			borderColor: theme.colors.borderColor,
			borderRadius: 12,
			backgroundColor: theme.colors.clearWhite,
			paddingHorizontal: 14,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
		},
		errorBorder: {
			borderColor: theme.colors.error,
		},
		focusedBorder: {
			borderColor: theme.colors.accentColor,
		},
		disabled: {
			opacity: 0.6,
		},
		valueText: {
			flex: 1,
			fontSize: 16,
			color: theme.colors.textColor,
			fontFamily: theme.typography.fontFamily,
		},
		placeholder: {
			color: theme.colors.labelColor,
		},
		controls: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: 6,
		},
		iconButton: {
			width: 24,
			height: 24,
			alignItems: 'center',
			justifyContent: 'center',
		},
	});
