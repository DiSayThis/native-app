import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

import { Search } from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import type { ICategoryDTO, IPartnerCard } from '@/entities/partner/model/partner.dto';

import { useDebouncedValue } from '@/shared/lib/use-debounced-value';
import { lightTheme } from '@/shared/styles/tokens';

import { CategoriesList } from './CategoriesList';
import { warmCategoryIcon } from './category-icon-cache';
import { PartnerCard } from './PartnerCard';

const LIST_INITIAL_RENDER = 8;
const LIST_BATCH_SIZE = 8;
const LIST_WINDOW_SIZE = 7;
const FIXED_TITLE_HEIGHT = 56;
const FIXED_TITLE_GRADIENT_HEIGHT = 96;

export type PartnersListData = {
	title: string;
	searchPlaceholder: string;
	emptyText: string;
	errorText: string;
	titleCentered?: boolean;
	partners: IPartnerCard[];
	categories?: ICategoryDTO[];
	isLoading: boolean;
	isError: boolean;
	onRetry: () => void | Promise<void>;
};

type PartnersListScreenProps = {
	data: PartnersListData;
	hideCategories?: boolean;
};

export function PartnersListScreen({ data, hideCategories = false }: PartnersListScreenProps) {
	const listRef = useRef<FlatList<IPartnerCard>>(null);
	useScrollToTop(listRef);

	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
	const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);

	const categoriesWithAll = useMemo<ICategoryDTO[]>(
		() => [{ id: -1, name: 'Все' }, ...(data.categories ?? [])],
		[data.categories],
	);

	useEffect(() => {
		if (hideCategories) {
			return;
		}

		for (const category of data.categories ?? []) {
			void warmCategoryIcon(category.IconUrl);
		}
	}, [data.categories, hideCategories]);

	const filteredPartners = useMemo(() => {
		const normalizedSearch = debouncedSearchQuery.trim().toLowerCase();
		return data.partners.filter((partner) => {
			const byCategory =
				hideCategories || selectedCategoryId === null
					? true
					: partner.categoryId === selectedCategoryId;
			const bySearch =
				normalizedSearch.length === 0
					? true
					: partner.heading.toLowerCase().includes(normalizedSearch) ||
						partner.subtitle.toLowerCase().includes(normalizedSearch);

			return byCategory && bySearch;
		});
	}, [data.partners, debouncedSearchQuery, hideCategories, selectedCategoryId]);

	const sortedPartners = useMemo(() => {
		const fixed = filteredPartners.filter((item) => item.isFixed);
		const regular = filteredPartners.filter((item) => !item.isFixed);
		return [...fixed, ...regular];
	}, [filteredPartners]);

	const keyExtractor = useCallback((item: IPartnerCard) => item.id, []);

	const renderPartnerItem = useCallback(
		({ item }: { item: IPartnerCard }) => <PartnerCard item={item} />,
		[],
	);

	if (data.isLoading) {
		return (
			<View style={styles.centerState}>
				<ActivityIndicator color={lightTheme.colors.accentColor} />
			</View>
		);
	}

	if (data.isError) {
		return (
			<View style={styles.centerState}>
				<Text style={styles.errorText}>{data.errorText}</Text>
				<Pressable onPress={() => void data.onRetry()} style={styles.retryButton}>
					<Text style={styles.retryText}>Повторить</Text>
				</Pressable>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View pointerEvents="none" style={styles.fixedTitleContainer}>
				<Svg
					style={styles.fixedTitleGradient}
					width="100%"
					height="100%"
					preserveAspectRatio="none"
				>
					<Defs>
						<LinearGradient id="partnersTitleGradient" x1="0" y1="0" x2="0" y2="1">
							<Stop offset="0" stopColor={lightTheme.colors.background} stopOpacity="1" />
							<Stop offset="0.4" stopColor={lightTheme.colors.background} stopOpacity="1" />
							<Stop offset="1" stopColor={lightTheme.colors.background} stopOpacity="0" />
						</LinearGradient>
					</Defs>
					<Rect x="0" y="0" width="100%" height="100%" fill="url(#partnersTitleGradient)" />
				</Svg>
				<View style={styles.fixedTitleContent}>
					<Text style={[styles.title, data.titleCentered ? styles.titleCentered : null]}>
						{data.title}
					</Text>
				</View>
			</View>

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
						<View style={styles.searchWrapper}>
							<Search size={16} color={lightTheme.colors.labelColor} />
							<TextInput
								value={searchQuery}
								onChangeText={setSearchQuery}
								placeholder={data.searchPlaceholder}
								placeholderTextColor={lightTheme.colors.labelColor}
								style={styles.searchInput}
							/>
						</View>

						{hideCategories ? null : (
							<CategoriesList
								categories={categoriesWithAll}
								selectedCategoryId={selectedCategoryId}
								onSelectCategory={setSelectedCategoryId}
							/>
						)}
					</View>
				}
				ListEmptyComponent={<Text style={styles.emptyText}>{data.emptyText}</Text>}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
	listContent: {
		paddingHorizontal: lightTheme.spacing.x4,
		paddingTop: FIXED_TITLE_HEIGHT + lightTheme.spacing.x4,
		paddingBottom: 120,
		gap: 14,
	},
	header: {
		gap: 12,
		marginBottom: 8,
	},
	fixedTitleContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: FIXED_TITLE_GRADIENT_HEIGHT,
		zIndex: 10,
	},
	fixedTitleGradient: {
		...StyleSheet.absoluteFillObject,
	},
	fixedTitleContent: {
		height: FIXED_TITLE_HEIGHT,
		paddingHorizontal: lightTheme.spacing.x4,
		justifyContent: 'center',
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
		textAlign: 'center',
	},
	titleCentered: {
		textAlign: 'center',
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
