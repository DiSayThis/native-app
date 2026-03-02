import { useEffect, useMemo, useState } from 'react';

import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	TextInput,
	type TextInputProps,
	View,
} from 'react-native';

import { Eye, EyeOff, X } from 'lucide-react-native';

import { lightTheme } from '@/shared/styles/tokens';

import { FormFieldShell } from './FormFieldShell';

export interface IInputBaseProps extends Omit<
	TextInputProps,
	'value' | 'onChange' | 'onChangeText'
> {
	label?: string;
	value?: string;
	onChange?: (value: string) => void;
	errorText?: string;
	showClearButton?: boolean;
	onClear?: () => void;
	isLoading?: boolean;
	type?: 'text' | 'password' | 'email' | 'tel' | 'number' | 'search' | 'url';
	showPasswordToggle?: boolean;
	togglePassword?: boolean;
	onTogglePassword?: () => void;
	multiline?: boolean;
	rows?: number;
	formatter?: (rawValue: string) => string;
}

export default function InputBase({
	label,
	value = '',
	onChange,
	errorText,
	showClearButton = false,
	onClear,
	isLoading = false,
	type = 'text',
	showPasswordToggle = false,
	togglePassword = false,
	onTogglePassword,
	multiline = false,
	rows = 3,
	formatter,
	style,
	editable,
	...rest
}: IInputBaseProps) {
	const [showPassword, setShowPassword] = useState(togglePassword);
	const [isFocused, setIsFocused] = useState(false);

	useEffect(() => {
		setShowPassword(togglePassword);
	}, [togglePassword]);

	const keyboardType = useMemo<TextInputProps['keyboardType']>(() => {
		if (type === 'email') return 'email-address';
		if (type === 'tel') return 'phone-pad';
		if (type === 'number') return 'numeric';
		if (type === 'url') return 'url';
		return 'default';
	}, [type]);

	const handleChange = (nextValue: string) => {
		const formatted = formatter ? formatter(nextValue) : nextValue;
		onChange?.(formatted);
	};

	const handleClear = () => {
		onChange?.('');
		onClear?.();
	};

	const isEditable = editable ?? !isLoading;
	const hasValue = Boolean(value);
	const hasToggle = showPasswordToggle && !multiline && !isLoading;
	const hasClear = hasValue && showClearButton && !isLoading;
	const secureTextEntry = showPasswordToggle ? !showPassword : type === 'password';

	return (
		<FormFieldShell label={label} errorText={errorText}>
			<View
				style={[
					styles.inputWrapper,
					!errorText && isFocused ? styles.focusedBorder : null,
					errorText ? styles.errorBorder : null,
				]}
			>
				<TextInput
					{...rest}
					style={[
						styles.input,
						multiline ? styles.multiline : null,
						hasToggle || hasClear || isLoading ? styles.withControls : null,
						style,
					]}
					value={value}
					onChangeText={handleChange}
					keyboardType={keyboardType}
					autoCapitalize={type === 'email' || type === 'password' ? 'none' : rest.autoCapitalize}
					autoCorrect={false}
					secureTextEntry={secureTextEntry}
					editable={isEditable}
					multiline={multiline}
					numberOfLines={multiline ? rows : 1}
					textAlignVertical={multiline ? 'top' : 'center'}
					onFocus={(event) => {
						setIsFocused(true);
						rest.onFocus?.(event);
					}}
					onBlur={(event) => {
						setIsFocused(false);
						rest.onBlur?.(event);
					}}
				/>

				<View style={styles.controls}>
					{isLoading ? (
						<ActivityIndicator size="small" color={lightTheme.colors.accentColor} />
					) : null}

					{hasClear ? (
						<Pressable
							onPress={handleClear}
							style={styles.iconButton}
							accessibilityLabel="Очистить"
						>
							<X size={24} color={lightTheme.colors.labelColor} />
						</Pressable>
					) : null}

					{hasToggle ? (
						<Pressable
							onPress={() => {
								setShowPassword((prev) => !prev);
								onTogglePassword?.();
							}}
							style={styles.iconButton}
							accessibilityLabel={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
						>
							{showPassword ? (
								<Eye size={24} color={lightTheme.colors.labelColor} />
							) : (
								<EyeOff size={24} color={lightTheme.colors.labelColor} />
							)}
						</Pressable>
					) : null}
				</View>
			</View>
		</FormFieldShell>
	);
}

const styles = StyleSheet.create({
	inputWrapper: {
		minHeight: 48,
		borderWidth: 1,
		borderColor: lightTheme.colors.borderColor,
		borderRadius: 12,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: lightTheme.colors.clearWhite,
	},
	errorBorder: {
		borderColor: lightTheme.colors.error,
	},
	focusedBorder: {
		borderColor: lightTheme.colors.accentColor,
	},
	input: {
		flex: 1,
		fontSize: 16,
		color: lightTheme.colors.textColor,
		fontFamily: lightTheme.typography.fontFamily,
		paddingHorizontal: 14,
		paddingVertical: 10,
	},
	withControls: {
		paddingRight: 8,
	},
	multiline: {
		minHeight: 88,
	},
	controls: {
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
});
