import InputBase, { type IInputBaseProps } from './InputBase';

interface IMaskedFieldProps extends Omit<IInputBaseProps, 'formatter'> {
	mask: (rawValue: string) => string;
}

export function MaskedField({ mask, ...rest }: IMaskedFieldProps) {
	return <InputBase {...rest} formatter={mask} />;
}
