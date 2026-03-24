import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { router } from 'expo-router';

import { type AppTheme } from '@/shared/styles/tokens';
import Button from '@/shared/ui/Button';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

export default function UnmatchedPage() {
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Ой что-то пошло не так</Text>
			<Text style={styles.text}>Попробуйте вернуться на главный экран приложения</Text>
			<Button style={styles.link} onPress={() => router.push('/discounts')}>
				Вернуться на главный экран
			</Button>
		</View>
	);
}

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
		container: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			padding: theme.spacing.x5,
			backgroundColor: theme.colors.background,
		},
		header: {
			fontSize: theme.typography.fontSizeHeading,
			color: theme.colors.textColor,
		},
		text: {
			fontSize: theme.typography.fontSizeBase,
			color: theme.colors.textColor,
			textAlign: 'center',
		},
		link: {
			marginTop: theme.spacing.x5,
			width: '100%',
		},
	});
