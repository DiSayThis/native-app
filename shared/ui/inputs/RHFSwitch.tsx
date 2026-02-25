import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form';

import { SwitchField } from './SwitchField';

type RHFSwitchProps<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
	label?: string;
	defaultValue?: boolean;
	disabled?: boolean;
};

export function RHFSwitch<T extends FieldValues>({
	control,
	name,
	label,
	defaultValue = false,
	disabled,
}: RHFSwitchProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			defaultValue={defaultValue as T[Path<T>]}
			render={({ field, fieldState }) => (
				<SwitchField
					label={label}
					value={Boolean(field.value)}
					onChange={field.onChange}
					errorText={fieldState.error?.message}
					disabled={disabled}
				/>
			)}
		/>
	);
}
