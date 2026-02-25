import { SelectAutocomplete, type SelectAutocompleteProps } from './SelectAutocomplete';

export function AutocompleteField(props: SelectAutocompleteProps) {
	return <SelectAutocomplete {...props} searchable />;
}
