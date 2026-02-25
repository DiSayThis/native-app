import { useMemo, useState } from 'react';

import {
	ActivityIndicator,
	FlatList,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';

import { ChevronDown, Search, X } from 'lucide-react-native';

import { lightTheme } from '@/shared/styles/tokens';

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
							<X size={16} color={lightTheme.colors.labelColor} />
						</Pressable>
					) : null}
					<ChevronDown size={16} color={lightTheme.colors.labelColor} />
				</View>
			</Pressable>

			<Modal visible={isOpen} transparent animationType="slide">
				<View style={styles.modalBackdrop}>
					<View style={styles.modalCard}>
						<View style={styles.header}>
							<Text style={styles.headerTitle}>{label ?? 'Выбор'}</Text>
							<Pressable
								onPress={() => {
									setIsOpen(false);
									onBlur?.();
								}}
							>
								<X size={18} color={lightTheme.colors.labelColor} />
							</Pressable>
						</View>

						{searchable ? (
							<View style={styles.searchWrapper}>
								<Search size={16} color={lightTheme.colors.labelColor} />
								<TextInput
									style={styles.searchInput}
									placeholder="Поиск"
									placeholderTextColor={lightTheme.colors.labelColor}
									value={query}
									onChangeText={setQuery}
								/>
							</View>
						) : null}

						{isLoading ? (
							<View style={styles.stateBlock}>
								<ActivityIndicator color={lightTheme.colors.accentColor} />
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
											setIsOpen(false);
											onBlur?.();
										}}
									>
										<Text style={styles.optionText}>{item.label}</Text>
									</Pressable>
								)}
							/>
						)}
					</View>
				</View>
			</Modal>
		</FormFieldShell>
	);
}

const styles = StyleSheet.create({
	inputWrapper: {
		minHeight: 48,
		borderWidth: 1,
		borderColor: lightTheme.colors.borderColor,
		borderRadius: 12,
		backgroundColor: '#fff',
		paddingHorizontal: 14,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	errorBorder: {
		borderColor: lightTheme.colors.error,
	},
	focusedBorder: {
		borderColor: lightTheme.colors.accentColor,
	},
	disabled: {
		opacity: 0.6,
	},
	valueText: {
		flex: 1,
		fontSize: 16,
		color: lightTheme.colors.textColor,
		fontFamily: lightTheme.typography.fontFamily,
	},
	placeholder: {
		color: lightTheme.colors.labelColor,
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
	modalBackdrop: {
		flex: 1,
		justifyContent: 'flex-end',
		backgroundColor: 'rgba(0,0,0,0.3)',
	},
	modalCard: {
		maxHeight: '80%',
		backgroundColor: '#fff',
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		padding: 16,
		gap: 12,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	headerTitle: {
		fontSize: 16,
		color: lightTheme.colors.textColor,
		fontFamily: lightTheme.typography.fontFamilyHeadings,
	},
	searchWrapper: {
		minHeight: 44,
		borderWidth: 1,
		borderColor: lightTheme.colors.borderColor,
		borderRadius: 10,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 10,
		gap: 8,
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		color: lightTheme.colors.textColor,
		fontFamily: lightTheme.typography.fontFamily,
	},
	option: {
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#f0f0f0',
	},
	optionText: {
		fontSize: 16,
		color: lightTheme.colors.textColor,
		fontFamily: lightTheme.typography.fontFamily,
	},
	stateBlock: {
		paddingVertical: 20,
		alignItems: 'center',
	},
	stateText: {
		color: lightTheme.colors.labelColor,
		fontFamily: lightTheme.typography.fontFamily,
	},
});
