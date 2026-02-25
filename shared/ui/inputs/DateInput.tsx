import { useMemo, useState } from 'react';

import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Calendar, X } from 'lucide-react-native';

import { lightTheme } from '@/shared/styles/tokens';

import { FormFieldShell } from './FormFieldShell';

type DateValue = Date | string;

const ISO_DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;

function parseToDate(value?: DateValue) {
	if (!value) return undefined;
	if (value instanceof Date) return value;
	if (ISO_DATE_FORMAT.test(value)) {
		const parsed = new Date(`${value}T00:00:00`);
		return Number.isNaN(parsed.getTime()) ? undefined : parsed;
	}
	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function formatDisplayDate(value?: Date) {
	if (!value) return '';
	const dd = `${value.getDate()}`.padStart(2, '0');
	const mm = `${value.getMonth() + 1}`.padStart(2, '0');
	const yyyy = value.getFullYear();
	return `${dd}.${mm}.${yyyy}`;
}

function formatISODate(value?: Date) {
	if (!value) return undefined;
	const dd = `${value.getDate()}`.padStart(2, '0');
	const mm = `${value.getMonth() + 1}`.padStart(2, '0');
	const yyyy = value.getFullYear();
	return `${yyyy}-${mm}-${dd}`;
}

interface IDateInputProps {
	label: string;
	value?: string;
	defaultValue?: DateValue;
	min?: DateValue;
	max?: DateValue;
	onChange?: (value?: string) => void;
	errorText?: string;
	showClearButton?: boolean;
	onClear?: () => void;
	disabled?: boolean;
}

export default function DateInput({
	label,
	value,
	defaultValue,
	min,
	max,
	onChange,
	errorText,
	showClearButton = false,
	onClear,
	disabled = false,
}: IDateInputProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [draftDate, setDraftDate] = useState<Date | undefined>();

	const selectedDate = useMemo(() => parseToDate(value ?? defaultValue), [value, defaultValue]);
	const minDate = useMemo(() => parseToDate(min), [min]);
	const maxDate = useMemo(() => parseToDate(max), [max]);
	const displayValue = formatDisplayDate(selectedDate);

	const clear = () => {
		onChange?.(undefined);
		onClear?.();
	};

	const open = () => {
		if (disabled) return;
		setDraftDate(selectedDate ?? new Date());
		setIsOpen(true);
	};

	const onAndroidChange = (event: DateTimePickerEvent, nextDate?: Date) => {
		setIsOpen(false);
		if (event.type === 'set' && nextDate) {
			onChange?.(formatISODate(nextDate));
		}
	};

	return (
		<FormFieldShell label={label} errorText={errorText}>
			<View
				style={[
					styles.inputWrapper,
					!errorText && isOpen ? styles.focusedBorder : null,
					errorText ? styles.errorBorder : null,
				]}
			>
				<Pressable style={styles.valueArea} onPress={open} disabled={disabled}>
					<Text style={[styles.valueText, !displayValue ? styles.placeholder : null]}>
						{displayValue || 'ДД.ММ.ГГГГ'}
					</Text>
				</Pressable>
				<View style={styles.actions}>
					<Pressable
						onPress={open}
						style={styles.iconButton}
						disabled={disabled}
						accessibilityLabel="Выбрать дату"
					>
						<Calendar size={16} color={lightTheme.colors.labelColor} />
					</Pressable>
					{showClearButton && displayValue && !disabled ? (
						<Pressable onPress={clear} style={styles.iconButton} accessibilityLabel="Очистить дату">
							<X size={16} color={lightTheme.colors.labelColor} />
						</Pressable>
					) : null}
				</View>
			</View>

			{isOpen && Platform.OS === 'android' ? (
				<DateTimePicker
					value={draftDate ?? new Date()}
					mode="date"
					minimumDate={minDate}
					maximumDate={maxDate}
					onChange={onAndroidChange}
				/>
			) : null}

			<Modal transparent visible={isOpen && Platform.OS === 'ios'} animationType="fade">
				<View style={styles.modalBackdrop}>
					<View style={styles.modalCard}>
						<View style={styles.modalHeader}>
							<Pressable onPress={() => setIsOpen(false)}>
								<Text style={styles.modalAction}>Отмена</Text>
							</Pressable>
							<Pressable
								onPress={() => {
									onChange?.(formatISODate(draftDate));
									setIsOpen(false);
								}}
							>
								<Text style={styles.modalAction}>Готово</Text>
							</Pressable>
						</View>
						<DateTimePicker
							value={draftDate ?? new Date()}
							mode="date"
							display="spinner"
							minimumDate={minDate}
							maximumDate={maxDate}
							onChange={(_, nextDate) => {
								if (nextDate) setDraftDate(nextDate);
							}}
						/>
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
		flexDirection: 'row',
		alignItems: 'center',
	},
	errorBorder: {
		borderColor: lightTheme.colors.error,
	},
	focusedBorder: {
		borderColor: lightTheme.colors.accentColor,
	},
	valueArea: {
		flex: 1,
		paddingHorizontal: 14,
		paddingVertical: 10,
	},
	valueText: {
		fontSize: 16,
		color: lightTheme.colors.textColor,
		fontFamily: lightTheme.typography.fontFamily,
	},
	placeholder: {
		color: lightTheme.colors.labelColor,
	},
	actions: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingRight: 8,
	},
	iconButton: {
		width: 28,
		height: 28,
		alignItems: 'center',
		justifyContent: 'center',
	},
	modalBackdrop: {
		flex: 1,
		justifyContent: 'flex-end',
		backgroundColor: 'rgba(0,0,0,0.3)',
	},
	modalCard: {
		backgroundColor: '#fff',
		paddingBottom: 20,
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: lightTheme.colors.borderColor,
	},
	modalAction: {
		color: lightTheme.colors.accentColor,
		fontSize: 16,
		fontFamily: lightTheme.typography.fontFamilyHeadings,
	},
});
