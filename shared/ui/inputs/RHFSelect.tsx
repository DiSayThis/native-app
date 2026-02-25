import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form';

import { SelectAutocomplete, type SelectAutocompleteProps } from './SelectAutocomplete';

type RHFSelectProps<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
	defaultValue?: string | number | boolean;
} & Omit<SelectAutocompleteProps, 'value' | 'onChange' | 'searchable'>;

export function RHFSelect<T extends FieldValues>({
	control,
	name,
	defaultValue,
	...rest
}: RHFSelectProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			defaultValue={defaultValue as T[Path<T>]}
			render={({ field, fieldState }) => (
				<SelectAutocomplete
					{...rest}
					searchable={false}
					value={field.value as string | number | boolean | undefined}
					onChange={field.onChange}
					errorText={rest.errorText || fieldState.error?.message}
					onBlur={field.onBlur}
				/>
			)}
		/>
	);
}
