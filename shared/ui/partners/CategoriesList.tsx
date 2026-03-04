import { useCallback, useRef, useState } from 'react';

import { FlatList, StyleSheet, View } from 'react-native';

import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import type { ICategoryDTO } from '@/features/discounts/model/discounts.dto';

import { lightTheme } from '@/shared/styles/tokens';

import { CategoryItem } from './CategoryItem';

type CategoriesListProps = {
	categories: ICategoryDTO[];
	selectedCategoryId: number | null;
	onSelectCategory: (categoryId: number | null) => void;
};

export function CategoriesList({
	categories,
	selectedCategoryId,
	onSelectCategory,
}: CategoriesListProps) {
	const scrollMetricsRef = useRef({
		offsetX: 0,
		viewportWidth: 0,
		contentWidth: 0,
	});
	const [showLeftGradient, setShowLeftGradient] = useState(false);
	const [showRightGradient, setShowRightGradient] = useState(false);

	const renderCategoryItem = useCallback(
		({ item }: { item: ICategoryDTO }) => {
			const isAll = item.id === -1;
			const isSelected = isAll ? selectedCategoryId === null : selectedCategoryId === item.id;

			return (
				<CategoryItem
					item={item}
					isSelected={isSelected}
					onPress={() => onSelectCategory(isAll ? null : item.id)}
				/>
			);
		},
		[selectedCategoryId, onSelectCategory],
	);

	const updateGradients = useCallback(
		({
			offsetX,
			viewportWidth,
			contentWidth,
		}: {
			offsetX: number;
			viewportWidth: number;
			contentWidth: number;
		}) => {
			const EDGE_EPSILON = 1;
			const canScroll = contentWidth - viewportWidth > EDGE_EPSILON;

			if (!canScroll) {
				setShowLeftGradient(false);
				setShowRightGradient(false);
				return;
			}

			setShowLeftGradient(offsetX > EDGE_EPSILON);
			setShowRightGradient(offsetX + viewportWidth < contentWidth - EDGE_EPSILON);
		},
		[],
	);

	const syncScrollMetrics = useCallback(
		(
			nextMetrics: Partial<{
				offsetX: number;
				viewportWidth: number;
				contentWidth: number;
			}>,
		) => {
			const merged = {
				...scrollMetricsRef.current,
				...nextMetrics,
			};

			scrollMetricsRef.current = merged;
			updateGradients(merged);
		},
		[updateGradients],
	);

	return (
		<View style={styles.listWrapper}>
			<FlatList
				data={categories}
				horizontal
				onLayout={(event) =>
					syncScrollMetrics({
						viewportWidth: event.nativeEvent.layout.width,
					})
				}
				onContentSizeChange={(width) =>
					syncScrollMetrics({
						contentWidth: width,
					})
				}
				onScroll={(event) =>
					syncScrollMetrics({
						offsetX: event.nativeEvent.contentOffset.x,
						viewportWidth: event.nativeEvent.layoutMeasurement.width,
						contentWidth: event.nativeEvent.contentSize.width,
					})
				}
				scrollEventThrottle={16}
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item) => String(item.id)}
				contentContainerStyle={styles.container}
				renderItem={renderCategoryItem}
			/>
			{showLeftGradient ? (
				<View pointerEvents="none" style={[styles.edgeGradient, styles.edgeGradientLeft]}>
					<Svg style={styles.edgeGradientSvg} width="100%" height="100%" preserveAspectRatio="none">
						<Defs>
							<LinearGradient id="categoriesFadeLeft" x1="0" y1="0" x2="1" y2="0">
								<Stop offset="0" stopColor={lightTheme.colors.background} stopOpacity="1" />
								<Stop offset="1" stopColor={lightTheme.colors.background} stopOpacity="0" />
							</LinearGradient>
						</Defs>
						<Rect x="0" y="0" width="100%" height="100%" fill="url(#categoriesFadeLeft)" />
					</Svg>
				</View>
			) : null}
			{showRightGradient ? (
				<View pointerEvents="none" style={[styles.edgeGradient, styles.edgeGradientRight]}>
					<Svg style={styles.edgeGradientSvg} width="100%" height="100%" preserveAspectRatio="none">
						<Defs>
							<LinearGradient id="categoriesFadeRight" x1="0" y1="0" x2="1" y2="0">
								<Stop offset="0" stopColor={lightTheme.colors.background} stopOpacity="0" />
								<Stop offset="1" stopColor={lightTheme.colors.background} stopOpacity="1" />
							</LinearGradient>
						</Defs>
						<Rect x="0" y="0" width="100%" height="100%" fill="url(#categoriesFadeRight)" />
					</Svg>
				</View>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 8,
		paddingVertical: 4,
	},
	listWrapper: {
		position: 'relative',
	},
	edgeGradient: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		width: 24,
		zIndex: 2,
	},
	edgeGradientLeft: {
		left: 0,
	},
	edgeGradientRight: {
		right: 0,
	},
	edgeGradientSvg: {
		...StyleSheet.absoluteFillObject,
	},
});
