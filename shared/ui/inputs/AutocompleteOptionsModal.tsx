import { useEffect, useMemo, useRef, useState } from 'react';

import {
	ActivityIndicator,
	Keyboard,
	Pressable,
	StyleSheet,
	Text,
	useWindowDimensions,
	View,
} from 'react-native';

import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetFlatList,
	BottomSheetModal,
	BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { Check, Search, X } from 'lucide-react-native';

import { useOverlayBackDismiss } from '@/shared/lib/use-overlay-back-dismiss';
import { type AppTheme } from '@/shared/styles/tokens';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

import type { SelectOption } from './types';

type SelectValue = string | number | boolean;
type SnapPoint = string | number;
type InitialSnapPoint = number | `${number}%` | 'auto';

type AutocompleteOptionsModalProps = {
	visible: boolean;
	onClose: () => void;
	title?: string;
	snapPoints?: SnapPoint[];
	initialSnapPoint?: InitialSnapPoint;
	selectedValue?: SelectValue;
	options: SelectOption[];
	searchable?: boolean;
	noOptionsText?: string;
	isLoading?: boolean;
	onSelect: (value: SelectValue) => void;
};

export function AutocompleteOptionsModal({
	visible,
	onClose,
	title = 'Выбор',
	snapPoints: externalSnapPoints,
	initialSnapPoint = 'auto',
	selectedValue,
	options,
	searchable = true,
	noOptionsText = 'Ничего не найдено',
	isLoading = false,
	onSelect,
}: AutocompleteOptionsModalProps) {
	const [query, setQuery] = useState('');
	const sheetRef = useRef<BottomSheetModal | null>(null);
	const { width, height } = useWindowDimensions();
	const { theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);
	const isWideLayout = width > height;
	const snapPoints = useMemo<SnapPoint[]>(
		() => externalSnapPoints ?? ['30%', '50%', '80%'],
		[externalSnapPoints],
	);

	const initialIndex = useMemo(() => {
		if (snapPoints.length === 0) return 0;
		if (initialSnapPoint === undefined) return 0;
		if (initialSnapPoint === 'auto') {
			const maxIndex = snapPoints.length - 1;
			if (maxIndex <= 0) return 0;
			if (isWideLayout) return maxIndex;

			const totalOptions = options.length;
			const smallOptionsLimit = 6;
			const largeOptionsLimit = 14;

			if (totalOptions <= smallOptionsLimit) return 0;
			if (totalOptions >= largeOptionsLimit) return maxIndex;

			return Math.floor(maxIndex / 2);
		}

		const normalizedTarget =
			typeof initialSnapPoint === 'number' ? `${initialSnapPoint}%` : initialSnapPoint.trim();

		const exactIndex = snapPoints.findIndex((point) => {
			const normalizedPoint = typeof point === 'number' ? `${point}%` : String(point).trim();
			return normalizedPoint === normalizedTarget;
		});
		if (exactIndex >= 0) return exactIndex;

		const targetPercent = Number.parseFloat(normalizedTarget.replace('%', ''));
		if (Number.isNaN(targetPercent)) return 0;

		let nearestIndex = 0;
		let nearestDistance = Number.POSITIVE_INFINITY;

		snapPoints.forEach((point, index) => {
			if (typeof point !== 'string' || !point.includes('%')) return;
			const pointPercent = Number.parseFloat(point.replace('%', '').trim());
			if (Number.isNaN(pointPercent)) return;
			const distance = Math.abs(pointPercent - targetPercent);
			if (distance < nearestDistance) {
				nearestDistance = distance;
				nearestIndex = index;
			}
		});

		return nearestIndex;
	}, [initialSnapPoint, isWideLayout, options.length, snapPoints]);

	const filteredOptions = useMemo(() => {
		if (!searchable) return options;
		const normalizedQuery = query.trim().toLowerCase();
		if (!normalizedQuery) return options;
		return options.filter((option) => option.label.toLowerCase().includes(normalizedQuery));
	}, [options, query, searchable]);

	useOverlayBackDismiss({
		enabled: visible,
		onDismiss: () => sheetRef.current?.dismiss(),
	});

	useEffect(() => {
		if (visible) {
			sheetRef.current?.present();
			return;
		}

		sheetRef.current?.dismiss();
	}, [visible]);

	const handleDismiss = () => {
		setQuery('');
		onClose();
	};

	const renderBackdrop = (props: BottomSheetBackdropProps) => (
		<BottomSheetBackdrop
			{...props}
			appearsOnIndex={0}
			disappearsOnIndex={-1}
			pressBehavior="close"
			opacity={0.4}
		/>
	);

	return (
		<BottomSheetModal
			ref={sheetRef}
			index={initialIndex}
			snapPoints={snapPoints}
			enablePanDownToClose
			enableDynamicSizing={false}
			backdropComponent={renderBackdrop}
			onDismiss={handleDismiss}
			backgroundStyle={styles.sheetBackground}
			handleIndicatorStyle={styles.handleIndicator}
			// keyboardBehavior={Platform.OS === 'ios' ? 'interactive' : 'fillParent'}
			keyboardBlurBehavior="restore"
			android_keyboardInputMode="adjustResize"
		>
			<View style={styles.content}>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>{title}</Text>
					<Pressable style={styles.iconButton} onPress={() => sheetRef.current?.dismiss()}>
						<X size={18} color={theme.colors.labelColor} />
					</Pressable>
				</View>

				{searchable ? (
					<View style={styles.searchWrapper}>
						<Search size={16} color={theme.colors.labelColor} />
						<BottomSheetTextInput
							style={styles.searchInput}
							placeholder="Поиск..."
							placeholderTextColor={theme.colors.labelColor}
							value={query}
							onChangeText={setQuery}
							selectionColor={theme.colors.accentColor}
						/>
					</View>
				) : null}

				{isLoading ? (
					<View style={styles.stateBlock}>
						<ActivityIndicator color={theme.colors.accentColor} />
					</View>
				) : filteredOptions.length === 0 ? (
					<View style={styles.stateBlock}>
						<Text style={styles.stateText}>{noOptionsText}</Text>
					</View>
				) : (
					<BottomSheetFlatList<SelectOption>
						data={filteredOptions}
						keyExtractor={(item: SelectOption) => String(item.value)}
						keyboardShouldPersistTaps="always"
						keyboardDismissMode="none"
						contentContainerStyle={styles.listContent}
						renderItem={({ item }: { item: SelectOption }) => {
							const isSelected = String(item.value) === String(selectedValue);

							return (
								<Pressable
									style={[styles.option, isSelected ? styles.optionSelected : null]}
									onPress={() => {
										Keyboard.dismiss();
										onSelect(item.value);
										sheetRef.current?.dismiss();
									}}
								>
									<Text style={[styles.optionText, isSelected ? styles.optionTextSelected : null]}>
										{item.label}
									</Text>
									<View
										style={[styles.checkCircle, isSelected ? styles.checkCircleSelected : null]}
									>
										{isSelected ? <Check size={12} color={theme.colors.accentTextColor} /> : null}
									</View>
								</Pressable>
							);
						}}
					/>
				)}
			</View>
		</BottomSheetModal>
	);
}

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
		sheetBackground: {
			backgroundColor: theme.colors.bgWhite,
			borderTopLeftRadius: 18,
			borderTopRightRadius: 18,
			overflow: 'hidden',
		},
		handleIndicator: {
			backgroundColor: theme.colors.labelColor,
			opacity: 0.45,
		},
		content: {
			flex: 1,
			paddingHorizontal: 16,
			paddingBottom: 12,
			gap: 12,
		},
		header: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
		},
		headerTitle: {
			fontSize: 16,
			color: theme.colors.textColor,
			fontFamily: theme.typography.fontFamilyHeadings,
		},
		iconButton: {
			width: 28,
			height: 28,
			alignItems: 'center',
			justifyContent: 'center',
		},
		searchWrapper: {
			minHeight: 44,
			borderWidth: 1,
			borderColor: theme.colors.borderColor,
			borderRadius: 10,
			flexDirection: 'row',
			alignItems: 'center',
			paddingHorizontal: 10,
			gap: 8,
		},
		searchInput: {
			flex: 1,
			fontSize: 16,
			color: theme.colors.textColor,
			fontFamily: theme.typography.fontFamily,
			paddingVertical: 0,
		},
		listContent: {
			paddingBottom: 8,
			gap: 6,
		},
		option: {
			minHeight: 46,
			paddingHorizontal: 12,
			paddingVertical: 10,
			borderRadius: 10,
			borderWidth: 1,
			borderColor: theme.colors.borderColor,
			backgroundColor: theme.colors.clearWhite,
			flexDirection: 'row',
			alignItems: 'flex-start',
			justifyContent: 'space-between',
		},
		optionSelected: {
			borderColor: theme.colors.accentColor,
			backgroundColor: theme.colors.accentHoverColor,
			color: theme.colors.accentTextColor,
		},
		checkCircle: {
			width: 20,
			height: 20,
			borderRadius: 999,
			borderWidth: 1,
			borderColor: theme.colors.borderColor,
			alignItems: 'center',
			justifyContent: 'center',
			marginLeft: 10,
			marginTop: 2,
		},
		checkCircleSelected: {
			backgroundColor: theme.colors.accentColor,
			borderColor: theme.colors.accentColor,
		},
		optionText: {
			flex: 1,
			flexShrink: 1,
			fontSize: 16,
			lineHeight: 22,
			color: theme.colors.textColor,
			fontFamily: theme.typography.fontFamily,
		},
		optionTextSelected: {
			color: theme.colors.accentTextColor,
		},
		stateBlock: {
			paddingVertical: 20,
			alignItems: 'center',
		},
		stateText: {
			color: theme.colors.labelColor,
			fontFamily: theme.typography.fontFamily,
		},
	});
