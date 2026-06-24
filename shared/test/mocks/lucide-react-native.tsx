import React from 'react';

import { View } from 'react-native';

type IconProps = {
	size?: number;
	color?: string;
	testID?: string;
};

function createIcon(name: string) {
	return function MockLucideIcon({ testID, ...props }: IconProps) {
		return <View accessibilityLabel={name} testID={testID ?? `icon-${name}`} {...props} />;
	};
}

export const Star = createIcon('Star');
export const Camera = createIcon('Camera');
export const GalleryVerticalEnd = createIcon('GalleryVerticalEnd');
export const Gift = createIcon('Gift');
export const Landmark = createIcon('Landmark');
export const TriangleAlert = createIcon('TriangleAlert');
export const UserPlus = createIcon('UserPlus');
export const Wallet = createIcon('Wallet');

const icons = {
	Star,
	Camera,
	GalleryVerticalEnd,
	Gift,
	Landmark,
	TriangleAlert,
	UserPlus,
	Wallet,
};

export default icons;
