import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form';

import DateInput from './DateInput';

type RHFDateInputProps<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
	label: string;
	disabled?: boolean;
};

export function RHFDateInput<T extends FieldValues>({
	control,
	name,
	label,
	disabled,
}: RHFDateInputProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<DateInput
					label={label}
					disabled={disabled}
					value={typeof field.value === 'string' ? field.value : undefined}
					onChange={field.onChange}
					errorText={fieldState.error?.message}
				/>
			)}
		/>
	);
}
