import { useCallback, useRef } from 'react';

import { BackHandler } from 'react-native';

import { useFocusEffect, useNavigation } from '@react-navigation/native';

type UseOverlayBackDismissParams = {
	enabled: boolean;
	onDismiss: () => void;
};

export function useOverlayBackDismiss({ enabled, onDismiss }: UseOverlayBackDismissParams) {
	const navigation = useNavigation();
	const isClosingRef = useRef(false);

	useFocusEffect(
		useCallback(() => {
			if (!enabled) {
				isClosingRef.current = false;
				return undefined;
			}

			const requestDismiss = () => {
				if (isClosingRef.current) {
					return true;
				}

				isClosingRef.current = true;
				onDismiss();

				return true;
			};

			const backSubscription = BackHandler.addEventListener('hardwareBackPress', requestDismiss);
			const unsubscribeBeforeRemove = navigation.addListener('beforeRemove', (event) => {
				event.preventDefault();
				requestDismiss();
			});

			return () => {
				isClosingRef.current = false;
				backSubscription.remove();
				unsubscribeBeforeRemove();
			};
		}, [enabled, navigation, onDismiss]),
	);
}
