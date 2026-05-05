import { useMemo, useState } from 'react';

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { useRouter } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { authAtom, logoutAtom } from '@/entities/auth/model/auth.store';
import { cityRegionAtom } from '@/entities/city-region/model/city-region.store';
import RegionSelectionModal from '@/entities/city-region/ui/RegionSelectionModal';
import { useUserProfile } from '@/entities/user/hook/useUserProfile';
import { UserProfileBlock } from '@/entities/user/ui/UserProfileBlock';

import { type AppTheme } from '@/shared/styles/tokens';
import Button from '@/shared/ui/Button';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

const THEME_OPTIONS = [
	{ value: 'system', label: 'Системная' },
	{ value: 'dark', label: 'Темная' },
	{ value: 'light', label: 'Светлая' },
] as const;

export default function ProfilePage() {
	const [isRegionModalVisible, setIsRegionModalVisible] = useState(false);
	const router = useRouter();
	const tabBarHeight = useBottomTabBarHeight();
	const insets = useSafeAreaInsets();
	const { theme, themeMode, setThemeMode } = useTheme();
	const styles = useMemo(
		() => createStyles(theme, tabBarHeight + insets.bottom + 48),
		[insets.bottom, tabBarHeight, theme],
	);

	const { id: studentId } = useAtomValue(authAtom);
	const { regionName } = useAtomValue(cityRegionAtom);
	const logout = useSetAtom(logoutAtom);
	const { profile, isLoading, isError, refetch } = useUserProfile(studentId);

	if (!studentId) {
		return (
			<View style={[styles.container, styles.centered]}>
				<Text style={styles.nameText}>Пользователь не авторизован</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<ScrollView
				style={styles.scroll}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<UserProfileBlock
					studentId={studentId}
					firstName={profile?.firstName}
					lastName={profile?.lastName}
					isLoading={isLoading}
					isError={isError}
					onRetry={() => void refetch()}
				/>

				<View style={styles.menuGroups}>
					<View style={styles.menuCard}>
						<Pressable style={styles.menuRow} onPress={() => setIsRegionModalVisible(true)}>
							<View style={styles.menuTextBlock}>
								<Text style={styles.menuLabel}>Регион</Text>
								<Text
									style={[styles.menuValue, !regionName ? styles.menuValuePlaceholder : null]}
									numberOfLines={1}
								>
									{regionName ?? 'Все регионы'}
								</Text>
							</View>
							<ChevronRight size={18} color={theme.colors.labelColor} />
						</Pressable>
						<View style={styles.menuDivider} />
						<View style={styles.themeSwitcherBlock}>
							<Text style={styles.menuLabel}>Тема</Text>
							<View style={styles.themeButtons}>
								{THEME_OPTIONS.map((option) => {
									const isActive = themeMode === option.value;
									return (
										<Pressable
											key={option.value}
											style={[styles.themeButton, isActive ? styles.themeButtonActive : null]}
											onPress={() => setThemeMode(option.value)}
										>
											<Text
												style={[
													styles.themeButtonText,
													isActive ? styles.themeButtonTextActive : null,
												]}
											>
												{option.label}
											</Text>
										</Pressable>
									);
								})}
							</View>
						</View>
					</View>

					<View style={styles.menuCard}>
						<Pressable style={styles.menuRow} onPress={() => router.push('/student-edit-profile')}>
							<View style={styles.menuTextBlock}>
								<Text style={styles.menuLabel}>Личная информация</Text>
								<Text style={[styles.menuValue, styles.menuValuePlaceholder]} numberOfLines={1}>
									Редактирование профиля
								</Text>
							</View>
							<ChevronRight size={18} color={theme.colors.labelColor} />
						</Pressable>
					</View>

					<View style={styles.menuCard}>
						<Pressable style={styles.menuRow} onPress={() => router.push('/support-form')}>
							<View style={styles.menuTextBlock}>
								<Text style={styles.menuLabel}>Техническая поддержка</Text>
								<Text style={[styles.menuValue, styles.menuValuePlaceholder]} numberOfLines={1}>
									Связаться с нами
								</Text>
							</View>
							<ChevronRight size={18} color={theme.colors.labelColor} />
						</Pressable>
						<View style={styles.menuDivider} />
						<Pressable style={styles.menuRow} onPress={() => router.push('/privacy-policy')}>
							<View style={styles.menuTextBlock}>
								<Text style={styles.menuLabel}>Политика конфиденциальности</Text>
								<Text style={[styles.menuValue, styles.menuValuePlaceholder]} numberOfLines={1}>
									Условия обработки данных
								</Text>
							</View>
							<ChevronRight size={18} color={theme.colors.labelColor} />
						</Pressable>
						<View style={styles.menuDivider} />
						<Pressable style={styles.menuRow} onPress={() => router.push('/cookies-policy')}>
							<View style={styles.menuTextBlock}>
								<Text style={styles.menuLabel}>Политика использования файлов cookies</Text>
								<Text style={[styles.menuValue, styles.menuValuePlaceholder]} numberOfLines={1}>
									Правила использования cookies
								</Text>
							</View>
							<ChevronRight size={18} color={theme.colors.labelColor} />
						</Pressable>
					</View>
				</View>

				<Button onPress={logout} variant="white">
					Выйти
				</Button>
			</ScrollView>

			<RegionSelectionModal
				visible={isRegionModalVisible}
				onClose={() => setIsRegionModalVisible(false)}
			/>
		</View>
	);
}

const createStyles = (theme: AppTheme, bottomContentInset: number) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.colors.background,
		},
		scroll: {
			flex: 1,
		},
		scrollContent: {
			padding: theme.spacing.x4,
			paddingBottom: bottomContentInset,
			gap: 14,
			flexGrow: 1,
		},
		menuGroups: {
			gap: 10,
		},
		menuCard: {
			borderRadius: 14,
			borderWidth: 1,
			borderColor: theme.colors.borderColor,
			backgroundColor: theme.colors.clearWhite,
			overflow: 'hidden',
		},
		menuRow: {
			minHeight: 62,
			paddingHorizontal: 14,
			paddingVertical: 10,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
		},
		menuTextBlock: {
			flex: 1,
			gap: 4,
			paddingRight: 12,
		},
		menuLabel: {
			fontFamily: theme.typography.fontFamilyHeadings,
			fontSize: 16,
			color: theme.colors.textColor,
		},
		menuValue: {
			fontFamily: theme.typography.fontFamily,
			fontSize: 14,
			color: theme.colors.textColor,
		},
		menuValuePlaceholder: {
			color: theme.colors.labelColor,
		},
		menuDivider: {
			height: 1,
			backgroundColor: theme.colors.borderColor,
		},
		themeSwitcherBlock: {
			gap: 10,
			paddingHorizontal: 14,
			paddingTop: 10,
			paddingBottom: 14,
		},
		themeButtons: {
			flexDirection: 'row',
			gap: 8,
		},
		themeButton: {
			flex: 1,
			minHeight: 40,
			borderRadius: 10,
			borderWidth: 1,
			borderColor: theme.colors.borderColor,
			backgroundColor: theme.colors.bgSecondary,
			alignItems: 'center',
			justifyContent: 'center',
			paddingHorizontal: 10,
		},
		themeButtonActive: {
			backgroundColor: theme.colors.accentColor,
			borderColor: theme.colors.accentColor,
		},
		themeButtonText: {
			fontFamily: theme.typography.fontFamily,
			fontSize: 13,
			color: theme.colors.textColor,
		},
		themeButtonTextActive: {
			fontFamily: theme.typography.fontFamilyHeadings,
			color: theme.colors.accentTextColor,
		},
		centered: {
			justifyContent: 'center',
		},
		nameText: {
			fontFamily: theme.typography.fontFamilyHeadings,
			fontSize: 28,
			fontWeight: 700,
			color: theme.colors.textColor,
			textAlign: 'center',
		},
	});
