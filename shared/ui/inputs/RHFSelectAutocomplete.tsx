import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form';

import { SelectAutocomplete, type SelectAutocompleteProps } from './SelectAutocomplete';

type RHFSelectAutocompleteProps<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
	defaultValue?: string | number | boolean;
} & Omit<SelectAutocompleteProps, 'value' | 'onChange' | 'onBlur'>;

export function RHFSelectAutocomplete<T extends FieldValues>({
	control,
	name,
	defaultValue,
	...rest
}: RHFSelectAutocompleteProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			defaultValue={defaultValue as T[Path<T>]}
			render={({ field, fieldState }) => (
				<SelectAutocomplete
					{...rest}
					value={field.value as string | number | boolean | undefined}
					onChange={field.onChange}
					onBlur={field.onBlur}
					errorText={rest.errorText || fieldState.error?.message}
				/>
			)}
		/>
	);
}

export type { SelectAutocompleteProps };
