import { useMemo, useState } from 'react';

import {
	ActivityIndicator,
	FlatList,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';

import { useAtomValue, useSetAtom } from 'jotai';
import { Check, Search, X } from 'lucide-react-native';

import { lightTheme } from '@/shared/styles/tokens';
import ModalSlide from '@/shared/ui/ModalSlide';

import { useCityRegionQuery } from '../hook/useCityRegionQuery';
import { cityRegionAtom, clearCityRegionAtom, setCityRegionAtom } from '../model/city-region.store';

interface IRegionSelectionModalProps {
	visible: boolean;
	onClose: () => void;
}

export default function RegionSelectionModal({ visible, onClose }: IRegionSelectionModalProps) {
	const [regionSearch, setRegionSearch] = useState('');

	const { regionId } = useAtomValue(cityRegionAtom);
	const setRegion = useSetAtom(setCityRegionAtom);
	const clearRegion = useSetAtom(clearCityRegionAtom);
	const { regions, isLoading: isLoadingRegions } = useCityRegionQuery({
		enabled: visible,
	});

	const filteredRegions = useMemo(() => {
		const normalizedQuery = regionSearch.trim().toLowerCase();
		if (!normalizedQuery) {
			return regions;
		}

		return regions.filter((region) => region.name.toLowerCase().includes(normalizedQuery));
	}, [regionSearch, regions]);

	const prioritizedRegions = useMemo(() => {
		if (!regionId) {
			return filteredRegions;
		}

		const selectedRegion = filteredRegions.find((region) => String(region.id) === String(regionId));
		if (!selectedRegion) {
			return filteredRegions;
		}

		return [
			selectedRegion,
			...filteredRegions.filter((region) => String(region.id) !== String(regionId)),
		];
	}, [filteredRegions, regionId]);

	const handleClose = () => {
		setRegionSearch('');
		onClose();
	};

	const handleSelectRegion = (nextRegionId: string, nextRegionName: string) => {
		setRegion({ regionId: nextRegionId, regionName: nextRegionName });
		handleClose();
	};

	const handleSelectAllRegions = () => {
		clearRegion();
		handleClose();
	};

	return (
		<ModalSlide visible={visible} onClose={handleClose} contentStyle={styles.modalCard}>
			<View style={styles.modalHeader}>
				<Text style={styles.modalTitle}>Выберите регион</Text>
				<Pressable onPress={handleClose} style={styles.iconButton}>
					<X size={18} color={lightTheme.colors.labelColor} />
				</Pressable>
			</View>

			<View style={styles.searchWrapper}>
				<Search size={16} color={lightTheme.colors.labelColor} />
				<TextInput
					value={regionSearch}
					onChangeText={setRegionSearch}
					placeholder="Поиск региона"
					placeholderTextColor={lightTheme.colors.labelColor}
					style={styles.searchInput}
				/>
			</View>

			{isLoadingRegions ? (
				<View style={styles.modalStateBlock}>
					<ActivityIndicator color={lightTheme.colors.accentColor} />
				</View>
			) : (
				<FlatList
					data={prioritizedRegions}
					keyExtractor={(item) => String(item.id)}
					keyboardShouldPersistTaps="handled"
					ListHeaderComponent={
						<Pressable style={styles.optionRow} onPress={handleSelectAllRegions}>
							<Text style={styles.optionLabel}>Все регионы</Text>
							{!regionId ? <Check size={16} color={lightTheme.colors.accentColor} /> : null}
						</Pressable>
					}
					ListEmptyComponent={
						<View style={styles.modalStateBlock}>
							<Text style={styles.modalStateText}>Такого региона нет</Text>
						</View>
					}
					renderItem={({ item }) => {
						const isSelected = String(item.id) === String(regionId);

						return (
							<Pressable
								style={styles.optionRow}
								onPress={() => handleSelectRegion(String(item.id), item.name)}
							>
								<Text style={styles.optionLabel}>{item.name}</Text>
								{isSelected ? <Check size={16} color={lightTheme.colors.accentColor} /> : null}
							</Pressable>
						);
					}}
				/>
			)}
		</ModalSlide>
	);
}

const styles = StyleSheet.create({
	modalCard: {
		maxHeight: '80%',
		gap: 12,
	},
	modalHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	modalTitle: {
		fontSize: 17,
		color: lightTheme.colors.textColor,
		fontFamily: lightTheme.typography.fontFamilyHeadings,
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
		borderColor: lightTheme.colors.borderColor,
		borderRadius: 10,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 10,
		gap: 8,
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		color: lightTheme.colors.textColor,
		fontFamily: lightTheme.typography.fontFamily,
	},
	modalStateBlock: {
		paddingVertical: 20,
		alignItems: 'center',
	},
	modalStateText: {
		fontFamily: lightTheme.typography.fontFamily,
		color: lightTheme.colors.labelColor,
	},
	optionRow: {
		minHeight: 48,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#f1f1f1',
	},
	optionLabel: {
		flex: 1,
		fontSize: 16,
		color: lightTheme.colors.textColor,
		fontFamily: lightTheme.typography.fontFamily,
		paddingRight: 10,
	},
});
