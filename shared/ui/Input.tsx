import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

export const Input = (props: TextInputProps) => {
	return <TextInput {...props} style={[styles.input, props.style]} />;
};

const styles = StyleSheet.create({
	input: {
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderWidth: 1,
		borderColor: '#123',
		color: '#ffffff',
		backgroundColor: '#000',
		height: 48,
		borderRadius: 8,
	},
});
