import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form';

import InputBase, { type IInputBaseProps } from './InputBase';

type RHFPasswordProps<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
	defaultValue?: string;
} & Omit<IInputBaseProps, 'value' | 'onChange' | 'type' | 'showPasswordToggle'>;

export function RHFPassword<T extends FieldValues>({
	control,
	name,
	defaultValue = '',
	...rest
}: RHFPasswordProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			defaultValue={defaultValue as T[Path<T>]}
			render={({ field, fieldState }) => (
				<InputBase
					{...rest}
					value={String(field.value ?? '')}
					onChange={field.onChange}
					errorText={fieldState.error?.message}
					onBlur={field.onBlur}
					type="password"
					showPasswordToggle
				/>
			)}
		/>
	);
}
