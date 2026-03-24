import { useMemo, useState } from 'react';

import {
	ActivityIndicator,
	FlatList,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';

import { ChevronDown, Search, X } from 'lucide-react-native';

import { type AppTheme } from '@/shared/styles/tokens';
import ModalSlide from '@/shared/ui/ModalSlide';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

import { FormFieldShell } from './FormFieldShell';
import type { SelectOption } from './types';

export type SelectAutocompleteProps = {
	value?: string | number | boolean;
	onChange: (value?: string | number | boolean) => void;
	options: SelectOption[];
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
	const [query, setQuery] = useState('');
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);

	const selectedOption = useMemo(
		() => options.find((option) => String(option.value) === String(value)),
		[options, value],
	);

	const filteredOptions = useMemo(() => {
		if (!searchable) return options;
		const text = query.trim().toLowerCase();
		if (!text) return options;
		return options.filter((option) => option.label.toLowerCase().includes(text));
	}, [options, query, searchable]);

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

			<ModalSlide visible={isOpen} onClose={handleClose} contentStyle={styles.modalCard}>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>{label ?? 'Выбор'}</Text>
					<Pressable onPress={handleClose}>
						<X size={18} color={theme.colors.labelColor} />
					</Pressable>
				</View>

				{searchable ? (
					<View style={styles.searchWrapper}>
						<Search size={16} color={theme.colors.labelColor} />
						<TextInput
							style={styles.searchInput}
							placeholder="Поиск"
							placeholderTextColor={theme.colors.labelColor}
							value={query}
							onChangeText={setQuery}
						/>
					</View>
				) : null}

				{isLoading ? (
					<View style={styles.stateBlock}>
						<ActivityIndicator color={theme.colors.accentColor} />
					</View>
				) : filteredOptions.length === 0 ? (
					<View style={styles.stateBlock}>
						<Text style={styles.stateText}>{noOptionsText}</Text>
					</View>
				) : (
					<FlatList
						data={filteredOptions}
						keyExtractor={(item) => String(item.value)}
						renderItem={({ item }) => (
							<Pressable
								style={styles.option}
								onPress={() => {
									onChange(item.value);
									handleClose();
								}}
							>
								<Text style={styles.optionText}>{item.label}</Text>
							</Pressable>
						)}
					/>
				)}
			</ModalSlide>
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
		modalCard: {
			maxHeight: '80%',
			gap: 12,
		},
		header: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
		},
		headerTitle: {
			fontSize: 16,
			color: theme.colors.textColor,
			fontFamily: theme.typography.fontFamilyHeadings,
		},
		searchWrapper: {
			minHeight: 44,
			borderWidth: 1,
			borderColor: theme.colors.borderColor,
			borderRadius: 10,
			flexDirection: 'row',
			alignItems: 'center',
			paddingHorizontal: 10,
			gap: 8,
		},
		searchInput: {
			flex: 1,
			fontSize: 16,
			color: theme.colors.textColor,
			fontFamily: theme.typography.fontFamily,
		},
		option: {
			paddingVertical: 12,
			borderBottomWidth: 1,
			borderBottomColor: theme.colors.borderColor,
		},
		optionText: {
			fontSize: 16,
			color: theme.colors.textColor,
			fontFamily: theme.typography.fontFamily,
		},
		stateBlock: {
			paddingVertical: 20,
			alignItems: 'center',
		},
		stateText: {
			color: theme.colors.labelColor,
			fontFamily: theme.typography.fontFamily,
		},
	});
