import InputBase, { type IInputBaseProps } from './InputBase';

export function MultilineField(props: Omit<IInputBaseProps, 'multiline'>) {
	return <InputBase {...props} multiline />;
}
