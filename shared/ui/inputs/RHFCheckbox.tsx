import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form';

import CheckboxInputBase, { type ICheckboxBaseProps } from './CheckboxInputBase';

type RHFCheckboxProps<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
	defaultValue?: boolean;
	children: React.ReactNode;
} & Omit<ICheckboxBaseProps, 'checked' | 'onChange' | 'children'>;

export function RHFCheckbox<T extends FieldValues>({
	control,
	name,
	defaultValue = false,
	children,
	...rest
}: RHFCheckboxProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			defaultValue={defaultValue as T[Path<T>]}
			render={({ field, fieldState }) => (
				<CheckboxInputBase
					{...rest}
					checked={Boolean(field.value)}
					onChange={field.onChange}
					errorText={fieldState.error?.message}
				>
					{children}
				</CheckboxInputBase>
			)}
		/>
	);
}
