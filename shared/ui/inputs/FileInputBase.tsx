import { useMemo } from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import * as DocumentPicker from 'expo-document-picker';
import { Paperclip, X } from 'lucide-react-native';

import { lightTheme } from '@/shared/styles/tokens';

import { FormFieldShell } from './FormFieldShell';

type FileValue = DocumentPicker.DocumentPickerAsset | DocumentPicker.DocumentPickerAsset[] | null;

export interface IFileInputBaseProps {
	label: string;
	errorText?: string;
	maxSizeMb?: number;
	allowedTypes?: string[];
	multiple?: boolean;
	onChange?: (file: FileValue) => void;
	value?: FileValue;
	showClearButton?: boolean;
	placeholder?: string;
	disabled?: boolean;
}

function toFileList(value?: FileValue) {
	if (!value) return [];
	return Array.isArray(value) ? value : [value];
}

export function FileInputBase({
	label,
	errorText,
	maxSizeMb = 30,
	allowedTypes = ['image/*', 'application/pdf'],
	multiple = false,
	onChange,
	value,
	showClearButton = true,
	placeholder,
	disabled = false,
}: IFileInputBaseProps) {
	const files = useMemo(() => toFileList(value), [value]);

	const pickFiles = async () => {
		if (disabled) return;

		const result = await DocumentPicker.getDocumentAsync({
			multiple,
			type: allowedTypes,
		});

		if (result.canceled) return;

		const maxBytes = maxSizeMb * 1024 * 1024;
		const invalid = result.assets.find((asset) => (asset.size ?? 0) > maxBytes);
		if (invalid) {
			onChange?.(null);
			return;
		}

		onChange?.(multiple ? result.assets : (result.assets[0] ?? null));
	};

	const clearFiles = () => onChange?.(null);

	return (
		<FormFieldShell label={label} errorText={errorText}>
			<Pressable
				style={({ pressed }) => [
					styles.input,
					!errorText && pressed ? styles.focusedBorder : null,
					errorText ? styles.errorBorder : null,
					disabled ? styles.disabled : null,
				]}
				onPress={pickFiles}
				disabled={disabled}
			>
				<View style={styles.left}>
					<Paperclip size={16} color={lightTheme.colors.labelColor} />
					<Text
						style={[styles.text, files.length === 0 ? styles.placeholder : null]}
						numberOfLines={1}
					>
						{files.length > 0
							? files.map((file) => file.name).join(', ')
							: (placeholder ?? (multiple ? 'Прикрепите файлы' : 'Прикрепите файл'))}
					</Text>
				</View>

				{showClearButton && files.length > 0 && !disabled ? (
					<Pressable onPress={clearFiles} style={styles.iconButton}>
						<X size={16} color={lightTheme.colors.labelColor} />
					</Pressable>
				) : null}
			</Pressable>
		</FormFieldShell>
	);
}

const styles = StyleSheet.create({
	input: {
		minHeight: 48,
		borderWidth: 1,
		borderColor: lightTheme.colors.borderColor,
		borderRadius: 12,
		paddingHorizontal: 12,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: lightTheme.colors.clearWhite,
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
	left: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	text: {
		flex: 1,
		fontSize: 16,
		color: lightTheme.colors.textColor,
		fontFamily: lightTheme.typography.fontFamily,
	},
	placeholder: {
		color: lightTheme.colors.labelColor,
	},
	iconButton: {
		width: 28,
		height: 28,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
