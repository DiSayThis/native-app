import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form';

import { FileInputBase, type IFileInputBaseProps } from './FileInputBase';

type RHFFileInputProps<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
} & Omit<IFileInputBaseProps, 'value' | 'onChange'>;

export function RHFFileInput<T extends FieldValues>({
	control,
	name,
	...rest
}: RHFFileInputProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<FileInputBase
					{...rest}
					value={field.value}
					errorText={fieldState.error?.message}
					onChange={field.onChange}
				/>
			)}
		/>
	);
}
