import { useEffect, useMemo, useState } from 'react';

import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { GalleryVerticalEnd } from 'lucide-react-native';
import { SvgXml } from 'react-native-svg';

import type { ICategoryDTO } from '@/entities/partner/model/partner.dto';

import { lightTheme } from '@/shared/styles/tokens';

import {
	getCachedSvgXml,
	getCategoryIconType,
	isSvgXmlDocument,
	markRasterIconReady,
	resolveSvgXml,
	warmCategoryIcon,
} from './category-icon-cache';

type CategoryItemProps = {
	item: ICategoryDTO;
	isSelected: boolean;
	onPress: () => void;
};

const ICON_SIZE = 24;

export function CategoryItem({ item, isSelected, onPress }: CategoryItemProps) {
	const initialType = useMemo(() => getCategoryIconType(item.IconUrl), [item.IconUrl]);
	const rasterSource = useMemo(
		() => (item.IconUrl ? { uri: item.IconUrl } : undefined),
		[item.IconUrl],
	);
	const [resolvedType, setResolvedType] = useState(initialType);
	const [svgXml, setSvgXml] = useState<string | null>(() => getCachedSvgXml(item.IconUrl));
	const [hasRasterError, setHasRasterError] = useState(false);
	const safeSvgXml = useMemo(() => (svgXml && isSvgXmlDocument(svgXml) ? svgXml : null), [svgXml]);
	const shouldRenderSvg = resolvedType === 'svg';
	const shouldShowPlaceholder = !item.IconUrl || (shouldRenderSvg ? !safeSvgXml : hasRasterError);

	useEffect(() => {
		let isMounted = true;
		const iconUrl = item.IconUrl;

		setResolvedType(getCategoryIconType(iconUrl));
		setSvgXml(getCachedSvgXml(iconUrl));
		setHasRasterError(false);

		if (!iconUrl) {
			return () => {
				isMounted = false;
			};
		}

		void warmCategoryIcon(iconUrl).then(() => {
			if (!isMounted) {
				return;
			}

			setResolvedType(getCategoryIconType(iconUrl));
			setSvgXml(getCachedSvgXml(iconUrl));
		});

		return () => {
			isMounted = false;
		};
	}, [item.IconUrl]);

	useEffect(() => {
		let isMounted = true;
		const iconUrl = item.IconUrl;

		if (!iconUrl || resolvedType !== 'svg' || svgXml) {
			return () => {
				isMounted = false;
			};
		}

		void resolveSvgXml(iconUrl).then((xml) => {
			if (isMounted && xml) {
				setSvgXml(xml);
			}
		});

		return () => {
			isMounted = false;
		};
	}, [item.IconUrl, resolvedType, svgXml]);

	return (
		<Pressable
			onPress={onPress}
			style={[styles.categoryChip, isSelected ? styles.categoryChipActive : null]}
		>
			<View style={styles.content}>
				<View style={styles.iconSlot}>
					{item.IconUrl ? (
						shouldRenderSvg ? (
							safeSvgXml ? (
								<SvgXml xml={safeSvgXml} width={ICON_SIZE} height={ICON_SIZE} />
							) : null
						) : (
							<Image
								source={rasterSource}
								style={styles.icon}
								resizeMode="contain"
								onLoadStart={() => {
									setHasRasterError(false);
								}}
								onLoad={() => {
									markRasterIconReady(item.IconUrl);
									setHasRasterError(false);
								}}
								onError={() => {
									setHasRasterError(true);

									if (!item.IconUrl) {
										return;
									}

									void resolveSvgXml(item.IconUrl).then((xml) => {
										if (xml) {
											setResolvedType('svg');
											setSvgXml(xml);
											setHasRasterError(false);
										}
									});
								}}
							/>
						)
					) : null}
					{shouldShowPlaceholder ? (
						<View style={styles.iconPlaceholder}>
							<GalleryVerticalEnd size={ICON_SIZE} color={lightTheme.colors.textColor} />
						</View>
					) : null}
				</View>
				<Text style={[styles.categoryText, isSelected ? styles.categoryTextActive : null]}>
					{item.name}
				</Text>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	categoryChip: {
		paddingHorizontal: 14,
		paddingVertical: 14,
		borderRadius: lightTheme.radius,
		borderWidth: 1,
		borderColor: lightTheme.colors.borderColor,
		backgroundColor: lightTheme.colors.clearWhite,
	},
	categoryChipActive: {
		backgroundColor: lightTheme.colors.accentColor,
		borderColor: lightTheme.colors.accentColor,
	},
	content: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		minHeight: 24,
	},
	iconSlot: {
		width: ICON_SIZE,
		height: ICON_SIZE,
		alignItems: 'center',
		justifyContent: 'center',
	},
	icon: {
		width: ICON_SIZE,
		height: ICON_SIZE,
	},
	iconPlaceholder: {
		width: ICON_SIZE,
		height: ICON_SIZE,
		alignItems: 'center',
		justifyContent: 'center',
	},
	categoryText: {
		fontFamily: lightTheme.typography.fontFamily,
		fontSize: 14,
		color: lightTheme.colors.textColor,
	},
	categoryTextActive: {
		fontWeight: '700',
	},
});
