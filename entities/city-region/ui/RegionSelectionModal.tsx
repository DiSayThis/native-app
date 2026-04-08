import { useMemo } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';

import { AutocompleteOptionsModal } from '@/shared/ui/inputs/AutocompleteOptionsModal';
import type { SelectOption } from '@/shared/ui/inputs/types';

import { useCityRegionQuery } from '../hook/useCityRegionQuery';
import { cityRegionAtom, clearCityRegionAtom, setCityRegionAtom } from '../model/city-region.store';

interface IRegionSelectionModalProps {
	visible: boolean;
	onClose: () => void;
}

const ALL_REGIONS_VALUE = '__all_regions__';

export default function RegionSelectionModal({ visible, onClose }: IRegionSelectionModalProps) {
	const { regionId } = useAtomValue(cityRegionAtom);
	const setRegion = useSetAtom(setCityRegionAtom);
	const clearRegion = useSetAtom(clearCityRegionAtom);
	const { regions, isLoading: isLoadingRegions } = useCityRegionQuery({
		enabled: visible,
	});

	const options = useMemo<SelectOption[]>(() => {
		const regionOptions = regions.map((region) => ({
			value: String(region.id),
			label: region.name,
		}));

		if (!regionId) {
			return [{ value: ALL_REGIONS_VALUE, label: 'Все регионы' }, ...regionOptions];
		}

		const selectedRegionIndex = regionOptions.findIndex(
			(region) => String(region.value) === String(regionId),
		);

		if (selectedRegionIndex <= 0) {
			return [{ value: ALL_REGIONS_VALUE, label: 'Все регионы' }, ...regionOptions];
		}

		const [selectedRegion] = regionOptions.splice(selectedRegionIndex, 1);

		return [selectedRegion, { value: ALL_REGIONS_VALUE, label: 'Все регионы' }, ...regionOptions];
	}, [regionId, regions]);

	return (
		<AutocompleteOptionsModal
			visible={visible}
			onClose={onClose}
			title="Выберите регион"
			selectedValue={regionId ? String(regionId) : ALL_REGIONS_VALUE}
			options={options}
			noOptionsText="Такого региона нет"
			isLoading={isLoadingRegions}
			onSelect={(nextValue) => {
				if (String(nextValue) === ALL_REGIONS_VALUE) {
					clearRegion();
					return;
				}

				const selectedRegion = regions.find((region) => String(region.id) === String(nextValue));
				if (!selectedRegion) return;

				setRegion({
					regionId: String(selectedRegion.id),
					regionName: selectedRegion.name,
				});
			}}
		/>
	);
}
