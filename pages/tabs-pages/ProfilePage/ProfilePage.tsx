import { useState } from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useRouter } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { ChevronRight } from 'lucide-react-native';

import { authAtom, logoutAtom } from '@/entities/auth/model/auth.store';
import { cityRegionAtom } from '@/entities/city-region/model/city-region.store';
import RegionSelectionModal from '@/entities/city-region/ui/RegionSelectionModal';
import { useUserProfile } from '@/entities/user/hook/useUserProfile';
import { UserProfileBlock } from '@/entities/user/ui/UserProfileBlock';

import { lightTheme } from '@/shared/styles/tokens';
import Button from '@/shared/ui/Button';

export default function ProfilePage() {
	const [isRegionModalVisible, setIsRegionModalVisible] = useState(false);
	const router = useRouter();

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
						<ChevronRight size={18} color={lightTheme.colors.labelColor} />
					</Pressable>
				</View>

				<View style={styles.menuCard}>
					<Pressable style={styles.menuRow} onPress={() => router.push('/student-edit-profile')}>
						<View style={styles.menuTextBlock}>
							<Text style={styles.menuLabel}>Личная информация</Text>
							<Text style={[styles.menuValue, styles.menuValuePlaceholder]} numberOfLines={1}>
								Редактирование профиля
							</Text>
						</View>
						<ChevronRight size={18} color={lightTheme.colors.labelColor} />
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
						<ChevronRight size={18} color={lightTheme.colors.labelColor} />
					</Pressable>
					<View style={styles.menuDivider} />
					<Pressable style={styles.menuRow} onPress={() => router.push('/privacy-policy')}>
						<View style={styles.menuTextBlock}>
							<Text style={styles.menuLabel}>Политика конфиденциальности</Text>
							<Text style={[styles.menuValue, styles.menuValuePlaceholder]} numberOfLines={1}>
								Условия обработки данных
							</Text>
						</View>
						<ChevronRight size={18} color={lightTheme.colors.labelColor} />
					</Pressable>
					<View style={styles.menuDivider} />
					<Pressable style={styles.menuRow} onPress={() => router.push('/cookies-policy')}>
						<View style={styles.menuTextBlock}>
							<Text style={styles.menuLabel}>Политика использования файлов cookies</Text>
							<Text style={[styles.menuValue, styles.menuValuePlaceholder]} numberOfLines={1}>
								Правила использования cookies
							</Text>
						</View>
						<ChevronRight size={18} color={lightTheme.colors.labelColor} />
					</Pressable>
				</View>
			</View>

			<Button onPress={logout} variant="white">
				Выйти
			</Button>

			<RegionSelectionModal
				visible={isRegionModalVisible}
				onClose={() => setIsRegionModalVisible(false)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: lightTheme.spacing.x4,
		backgroundColor: lightTheme.colors.background,
		gap: 14,
	},
	menuGroups: {
		gap: 10,
	},
	menuCard: {
		borderRadius: 14,
		borderWidth: 1,
		borderColor: lightTheme.colors.borderColor,
		backgroundColor: lightTheme.colors.clearWhite,
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
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: 16,
		color: lightTheme.colors.textColor,
	},
	menuValue: {
		fontFamily: lightTheme.typography.fontFamily,
		fontSize: 14,
		color: lightTheme.colors.textColor,
	},
	menuValuePlaceholder: {
		color: lightTheme.colors.labelColor,
	},
	menuDivider: {
		height: 1,
		backgroundColor: '#f1f1f1',
	},
	centered: {
		justifyContent: 'center',
	},
	nameText: {
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: 28,
		fontWeight: 700,
		color: lightTheme.colors.textColor,
		textAlign: 'center',
	},
});
