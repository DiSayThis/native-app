import { useEffect, useMemo, useState } from 'react';

import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { GalleryVerticalEnd } from 'lucide-react-native';
import Animated, {
	Easing,
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { SvgXml } from 'react-native-svg';

import type { ICategoryDTO } from '@/entities/partner/model/partner.dto';

import { type AppTheme } from '@/shared/styles/tokens';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

import {
	getCachedSvgXml,
	getCategoryIconType,
	isRasterIconInvertible,
	isRasterIconReady,
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
const SELECTION_ANIMATION_DURATION = 240;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CategoryItem({ item, isSelected, onPress }: CategoryItemProps) {
	const { scheme, theme } = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);
	const initialType = useMemo(() => getCategoryIconType(item.IconUrl), [item.IconUrl]);
	const rasterSource = useMemo(
		() => (item.IconUrl ? { uri: item.IconUrl } : undefined),
		[item.IconUrl],
	);
	const shouldInvertRasterIcon = useMemo(
		() => scheme === 'dark' && !isSelected && isRasterIconInvertible(item.IconUrl),
		[scheme, isSelected, item.IconUrl],
	);
	const [resolvedType, setResolvedType] = useState(initialType);
	const [svgXml, setSvgXml] = useState<string | null>(() => getCachedSvgXml(item.IconUrl));
	const [hasRasterError, setHasRasterError] = useState(false);
	const [chipWidth, setChipWidth] = useState(0);
	const selectionProgress = useSharedValue(isSelected ? 1 : 0);
	const safeSvgXml = useMemo(() => (svgXml && isSvgXmlDocument(svgXml) ? svgXml : null), [svgXml]);
	const themedSvgXml = useMemo(
		() => (safeSvgXml ? colorizeSvgToCurrentColor(safeSvgXml) : null),
		[safeSvgXml],
	);
	const svgColor = isSelected ? theme.colors.accentTextColor : theme.colors.textColor;
	const shouldRenderSvg = resolvedType === 'svg';
	const isRasterReady = isRasterIconReady(item.IconUrl);
	const shouldShowPlaceholder =
		!item.IconUrl || (shouldRenderSvg ? !safeSvgXml : hasRasterError || !isRasterReady);

	const animatedChipStyle = useAnimatedStyle(
		() => ({
			borderColor: interpolateColor(
				selectionProgress.value,
				[0, 1],
				[theme.colors.borderColor, theme.colors.accentColor],
			),
		}),
		[theme.colors.accentColor, theme.colors.borderColor],
	);

	const animatedFillStyle = useAnimatedStyle(() => ({
		width: chipWidth * selectionProgress.value,
	}));

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

	useEffect(() => {
		selectionProgress.value = withTiming(isSelected ? 1 : 0, {
			duration: SELECTION_ANIMATION_DURATION,
			easing: Easing.out(Easing.cubic),
		});
	}, [isSelected, selectionProgress]);

	return (
		<AnimatedPressable
			onPress={onPress}
			onLayout={(event) => {
				const nextWidth = event.nativeEvent.layout.width;
				if (nextWidth && nextWidth !== chipWidth) {
					setChipWidth(nextWidth);
				}
			}}
			style={[styles.categoryChip, animatedChipStyle]}
		>
			<Animated.View pointerEvents="none" style={[styles.selectionFill, animatedFillStyle]} />

			<View style={styles.content}>
				<View style={styles.iconSlot}>
					{item.IconUrl ? (
						shouldRenderSvg ? (
							themedSvgXml ? (
								<SvgXml xml={themedSvgXml} width={ICON_SIZE} height={ICON_SIZE} color={svgColor} />
							) : null
						) : (
							<Image
								source={rasterSource}
								style={[styles.icon, shouldInvertRasterIcon ? styles.iconInverted : null]}
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
						<View testID="category-icon-placeholder" style={styles.iconPlaceholder}>
							<GalleryVerticalEnd size={ICON_SIZE} color={svgColor} />
						</View>
					) : null}
				</View>
				<Text style={[styles.categoryText, isSelected ? styles.categoryTextActive : null]}>
					{item.name}
				</Text>
			</View>
		</AnimatedPressable>
	);
}

const createStyles = (theme: AppTheme) =>
	StyleSheet.create({
		categoryChip: {
			paddingHorizontal: 14,
			paddingVertical: 14,
			borderRadius: theme.radius,
			borderWidth: 1,
			borderColor: theme.colors.borderColor,
			backgroundColor: theme.colors.clearWhite,
			overflow: 'hidden',
		},
		selectionFill: {
			position: 'absolute',
			top: 0,
			bottom: 0,
			left: 0,
			backgroundColor: theme.colors.accentColor,
		},
		content: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: 6,
			minHeight: 24,
			zIndex: 1,
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
		iconInverted: {
			filter: [{ invert: 1 }],
		},
		iconPlaceholder: {
			width: ICON_SIZE,
			height: ICON_SIZE,
			alignItems: 'center',
			justifyContent: 'center',
		},
		categoryText: {
			fontFamily: theme.typography.fontFamily,
			fontSize: 14,
			color: theme.colors.textColor,
		},
		categoryTextActive: {
			fontWeight: '700',
			color: theme.colors.accentTextColor,
		},
	});

const colorizeSvgToCurrentColor = (svgXml: string): string => {
	const replaceColorValue = (value: string): string => {
		const normalized = value.trim().toLowerCase();
		if (normalized === 'none' || normalized.startsWith('url(') || normalized === 'currentcolor') {
			return value;
		}
		return 'currentColor';
	};

	const withAttrColor = svgXml.replace(
		/\s(fill|stroke)\s*=\s*(['"])(.*?)\2/gi,
		(_match, attr: string, quote: string, value: string) =>
			` ${attr}=${quote}${replaceColorValue(value)}${quote}`,
	);

	return withAttrColor.replace(
		/style\s*=\s*(['"])(.*?)\1/gi,
		(_match, quote: string, style: string) => {
			const nextStyle = style.replace(
				/(^|;)\s*(fill|stroke)\s*:\s*([^;]+)/gi,
				(_styleMatch, separator: string, prop: string, value: string) =>
					`${separator} ${prop}: ${replaceColorValue(value.trim())}`,
			);
			return `style=${quote}${nextStyle}${quote}`;
		},
	);
};
