import { memo, useCallback, useMemo, useRef, useState } from 'react';

import {
	ActivityIndicator,
	FlatList,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';

import { useScrollToTop } from '@react-navigation/native';

import { router } from 'expo-router';
import { Search } from 'lucide-react-native';

import { useDiscountsData } from '@/features/discounts/hook/useDiscountsData';
import type { ICategoryDTO, IPartnerCard } from '@/features/discounts/model/discounts.dto';

import { useDebouncedValue } from '@/shared/lib/use-debounced-value';
import { lightTheme } from '@/shared/styles/tokens';

const LIST_INITIAL_RENDER = 8;
const LIST_BATCH_SIZE = 8;
const LIST_WINDOW_SIZE = 7;

export default function DiscountsScreen() {
	const listRef = useRef<FlatList<IPartnerCard>>(null);
	useScrollToTop(listRef);

	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
	const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);
	const { categories, partners, isLoading, isError, refetch } = useDiscountsData();

	const filteredPartners = useMemo(() => {
		const normalizedSearch = debouncedSearchQuery.trim().toLowerCase();
		return partners.filter((partner) => {
			const byCategory =
				selectedCategoryId === null ? true : partner.categoryId === selectedCategoryId;
			const bySearch =
				normalizedSearch.length === 0
					? true
					: partner.heading.toLowerCase().includes(normalizedSearch) ||
						partner.subtitle.toLowerCase().includes(normalizedSearch);

			return byCategory && bySearch;
		});
	}, [partners, debouncedSearchQuery, selectedCategoryId]);

	const sortedPartners = useMemo(() => {
		const fixed = filteredPartners.filter((item) => item.isFixed);
		const regular = filteredPartners.filter((item) => !item.isFixed);
		return [...fixed, ...regular];
	}, [filteredPartners]);

	const categoriesWithAll = useMemo<ICategoryDTO[]>(
		() => [{ id: -1, name: 'Все' }, ...categories],
		[categories],
	);

	const keyExtractor = useCallback((item: IPartnerCard) => item.id, []);

	const renderPartnerItem = useCallback(
		({ item }: { item: IPartnerCard }) => <MemoPartnerCard item={item} />,
		[],
	);

	const renderCategoryItem = useCallback(
		({ item }: { item: ICategoryDTO }) => {
			const isAll = item.id === -1;
			const isSelected = isAll ? selectedCategoryId === null : selectedCategoryId === item.id;

			return (
				<Pressable
					onPress={() => setSelectedCategoryId(isAll ? null : item.id)}
					style={[styles.categoryChip, isSelected ? styles.categoryChipActive : null]}
				>
					<Text style={[styles.categoryText, isSelected ? styles.categoryTextActive : null]}>
						{item.name}
					</Text>
				</Pressable>
			);
		},
		[selectedCategoryId],
	);

	if (isLoading) {
		return (
			<View style={styles.centerState}>
				<ActivityIndicator color={lightTheme.colors.accentColor} />
			</View>
		);
	}

	if (isError) {
		return (
			<View style={styles.centerState}>
				<Text style={styles.errorText}>Не удалось загрузить скидки</Text>
				<Pressable onPress={() => void refetch()} style={styles.retryButton}>
					<Text style={styles.retryText}>Повторить</Text>
				</Pressable>
			</View>
		);
	}

	return (
		<FlatList
			ref={listRef}
			data={sortedPartners}
			keyExtractor={keyExtractor}
			renderItem={renderPartnerItem}
			removeClippedSubviews
			initialNumToRender={LIST_INITIAL_RENDER}
			maxToRenderPerBatch={LIST_BATCH_SIZE}
			windowSize={LIST_WINDOW_SIZE}
			updateCellsBatchingPeriod={50}
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={styles.listContent}
			ListHeaderComponent={
				<View style={styles.header}>
					<Text style={styles.title}>Скидки</Text>

					<View style={styles.searchWrapper}>
						<Search size={16} color={lightTheme.colors.labelColor} />
						<TextInput
							value={searchQuery}
							onChangeText={setSearchQuery}
							placeholder="Поиск по партнерам"
							placeholderTextColor={lightTheme.colors.labelColor}
							style={styles.searchInput}
						/>
					</View>

					<FlatList
						data={categoriesWithAll}
						horizontal
						showsHorizontalScrollIndicator={false}
						keyExtractor={(item) => String(item.id)}
						contentContainerStyle={styles.categoriesContainer}
						renderItem={renderCategoryItem}
					/>
				</View>
			}
			ListEmptyComponent={<Text style={styles.emptyText}>По вашему запросу ничего не найдено</Text>}
		/>
	);
}

const MemoPartnerCard = memo(function PartnerCard({ item }: { item: IPartnerCard }) {
	return (
		<Pressable
			style={[styles.card, item.isFixed ? styles.fixedCard : null]}
			onPress={() => router.push(`/partner-offer/${item.id}`)}
		>
			<View style={styles.discountBadge}>
				<Text style={styles.discountText}>{item.discount ? `${item.discount}%` : '0%'}</Text>
			</View>
			<Text style={styles.cardTitle}>{item.heading}</Text>
			<Text style={styles.cardSubtitle}>{item.subtitle}</Text>
		</Pressable>
	);
});

const styles = StyleSheet.create({
	listContent: {
		paddingHorizontal: lightTheme.spacing.x4,
		paddingTop: lightTheme.spacing.x4,
		paddingBottom: 120,
		gap: 12,
		backgroundColor: lightTheme.colors.background,
	},
	header: {
		gap: 12,
		marginBottom: 8,
	},
	centerState: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: lightTheme.spacing.x4,
	},
	title: {
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: lightTheme.typography.fontSizeHeading,
		color: lightTheme.colors.textColor,
	},
	searchWrapper: {
		height: 46,
		borderWidth: 1,
		borderColor: lightTheme.colors.borderColor,
		borderRadius: 12,
		backgroundColor: lightTheme.colors.clearWhite,
		paddingHorizontal: 12,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		fontFamily: lightTheme.typography.fontFamily,
		color: lightTheme.colors.textColor,
	},
	categoriesContainer: {
		gap: 8,
		paddingVertical: 4,
	},
	categoryChip: {
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 18,
		borderWidth: 1,
		borderColor: lightTheme.colors.borderColor,
		backgroundColor: lightTheme.colors.clearWhite,
	},
	categoryChipActive: {
		backgroundColor: lightTheme.colors.accentColor,
		borderColor: lightTheme.colors.accentColor,
	},
	categoryText: {
		fontFamily: lightTheme.typography.fontFamily,
		fontSize: 14,
		color: lightTheme.colors.textColor,
	},
	categoryTextActive: {
		fontFamily: lightTheme.typography.fontFamilyHeadings,
	},
	card: {
		padding: 14,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: lightTheme.colors.borderColor,
		backgroundColor: lightTheme.colors.clearWhite,
		gap: 8,
	},
	fixedCard: {
		borderColor: lightTheme.colors.accentColor,
	},
	discountBadge: {
		alignSelf: 'flex-start',
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 999,
		backgroundColor: lightTheme.colors.accentColor,
	},
	discountText: {
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		color: lightTheme.colors.accentTextColor,
		fontSize: 12,
	},
	cardTitle: {
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: 18,
		color: lightTheme.colors.textColor,
	},
	cardSubtitle: {
		fontFamily: lightTheme.typography.fontFamily,
		fontSize: 14,
		color: lightTheme.colors.textColor,
		opacity: 0.9,
	},
	emptyText: {
		textAlign: 'center',
		fontFamily: lightTheme.typography.fontFamily,
		color: lightTheme.colors.labelColor,
		paddingTop: 40,
	},
	errorText: {
		fontFamily: lightTheme.typography.fontFamily,
		color: lightTheme.colors.error,
		marginBottom: 10,
	},
	retryButton: {
		height: 40,
		paddingHorizontal: 16,
		borderRadius: 10,
		backgroundColor: lightTheme.colors.accentColor,
		alignItems: 'center',
		justifyContent: 'center',
	},
	retryText: {
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		color: lightTheme.colors.accentTextColor,
	},
});
