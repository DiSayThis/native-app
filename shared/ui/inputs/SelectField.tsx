import { SelectAutocomplete, type SelectAutocompleteProps } from './SelectAutocomplete';

export function SelectField(props: Omit<SelectAutocompleteProps, 'searchable'>) {
	return <SelectAutocomplete {...props} searchable={false} />;
}
