import { useEffect, useMemo, useRef, useState } from 'react';

import type { ImageStyle, StyleProp } from 'react-native';

import { Image } from 'expo-image';

import { useTheme } from '@/shared/ui/theme/ThemeProvider';

import { buildPartnerImageUri } from '../lib/partner-image';

const PARTNER_IMAGE_PLACEHOLDER = require('../../../shared/assets/placeholder.jpg');
const IMAGE_STALL_TIMEOUT_MS = 6000;
const MAX_IMAGE_RETRIES = 2;

type PartnerImageProps = {
	partnerId: string;
	style?: StyleProp<ImageStyle>;
	testID?: string;
	transition?: number;
};

type LoadState = {
	hasImageError: boolean;
	retryCount: number;
};

export function PartnerImage({ partnerId, style, testID, transition = 120 }: PartnerImageProps) {
	const { theme } = useTheme();
	const imageUri = useMemo(() => buildPartnerImageUri(partnerId), [partnerId]);
	const stallTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [{ hasImageError, retryCount }, setLoadState] = useState<LoadState>({
		hasImageError: false,
		retryCount: 0,
	});

	const clearStallTimeout = () => {
		if (stallTimeoutRef.current) {
			clearTimeout(stallTimeoutRef.current);
			stallTimeoutRef.current = null;
		}
	};

	const retryImage = () => {
		clearStallTimeout();
		setLoadState((current) => {
			if (current.retryCount >= MAX_IMAGE_RETRIES) {
				return current.hasImageError ? current : { ...current, hasImageError: true };
			}

			return {
				hasImageError: false,
				retryCount: current.retryCount + 1,
			};
		});
	};

	useEffect(() => {
		clearStallTimeout();
		setLoadState({
			hasImageError: false,
			retryCount: 0,
		});

		return clearStallTimeout;
	}, [imageUri]);

	const imageRequestKey = `${imageUri}:${retryCount}`;

	return (
		<Image
			key={imageRequestKey}
			recyclingKey={imageRequestKey}
			testID={testID}
			source={hasImageError ? PARTNER_IMAGE_PLACEHOLDER : { uri: imageUri }}
			placeholder={PARTNER_IMAGE_PLACEHOLDER}
			contentFit="cover"
			placeholderContentFit="cover"
			cachePolicy="memory-disk"
			transition={hasImageError ? 0 : transition}
			style={[{ backgroundColor: theme.colors.borderColor }, style]}
			onLoadStart={() => {
				if (hasImageError) {
					return;
				}

				clearStallTimeout();
				stallTimeoutRef.current = setTimeout(retryImage, IMAGE_STALL_TIMEOUT_MS);
			}}
			onLoad={() => {
				clearStallTimeout();
				setLoadState((current) =>
					current.hasImageError ? current : { ...current, hasImageError: false },
				);
			}}
			onError={() => {
				retryImage();
			}}
		/>
	);
}
