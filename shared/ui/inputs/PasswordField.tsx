import InputBase, { type IInputBaseProps } from './InputBase';

export function PasswordField(props: Omit<IInputBaseProps, 'type' | 'showPasswordToggle'>) {
	return <InputBase {...props} type="password" showPasswordToggle />;
}
