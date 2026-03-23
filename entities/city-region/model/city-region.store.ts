import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

import type { ICityRegionState } from './city-region.dto';

const INITIAL_STATE: ICityRegionState = {
	regionId: undefined,
	regionName: undefined,
};

const cityRegionStorage = createJSONStorage<ICityRegionState>(() => AsyncStorage);

export const cityRegionAtom = atomWithStorage<ICityRegionState>(
	'city-region',
	INITIAL_STATE,
	cityRegionStorage,
);

export const setCityRegionAtom = atom(
	null,
	(_get, set, nextState: { regionId: string; regionName: string }) => {
		set(cityRegionAtom, {
			regionId: nextState.regionId,
			regionName: nextState.regionName,
		});
	},
);

export const clearCityRegionAtom = atom(null, (_get, set) => {
	set(cityRegionAtom, { ...INITIAL_STATE });
});
