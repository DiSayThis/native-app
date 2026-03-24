import { useMemo } from 'react';

import { Linking } from 'react-native';

import Markdown, { MarkdownIt, type MarkdownProps } from 'react-native-markdown-renderer';

import { type AppTheme } from '@/shared/styles/tokens';
import { useTheme } from '@/shared/ui/theme/ThemeProvider';

type MarkdownTextProps = {
	content?: string | null;
	style?: MarkdownProps['style'];
};

const markdownIt = new MarkdownIt({
	breaks: true,
	linkify: true,
	typographer: true,
});

export default function MarkdownText({ content, style }: MarkdownTextProps) {
	const { theme } = useTheme();
	const normalizedContent = content?.trim();
	const markdownStyle = useMemo(() => {
		const baseMarkdownStyle = createBaseMarkdownStyle(theme);
		return style ? { ...baseMarkdownStyle, ...style } : baseMarkdownStyle;
	}, [style, theme]);

	if (!normalizedContent) {
		return null;
	}

	const handleLinkPress = (url: string) => {
		if (!url) {
			return false;
		}

		void Linking.canOpenURL(url)
			.then((canOpen) => {
				if (!canOpen) {
					return;
				}

				return Linking.openURL(url);
			})
			.catch(() => undefined);

		return false;
	};

	return (
		<Markdown markdownit={markdownIt} style={markdownStyle} onLinkPress={handleLinkPress}>
			{normalizedContent}
		</Markdown>
	);
}

const createBaseMarkdownStyle = (theme: AppTheme): MarkdownProps['style'] => ({
	body: {
		color: theme.colors.textColor,
		fontFamily: theme.typography.fontFamily,
		fontSize: 16,
		lineHeight: 22,
		opacity: 0.95,
	},
	paragraph: {
		marginTop: 0,
		marginBottom: 10,
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	text: {
		color: theme.colors.textColor,
		fontFamily: theme.typography.fontFamily,
		fontSize: 16,
		lineHeight: 22,
	},
	heading1: {
		fontFamily: theme.typography.fontFamilyHeadings,
		fontSize: 28,
		fontWeight: '700',
		color: theme.colors.textColor,
		marginBottom: 10,
	},
	heading2: {
		fontFamily: theme.typography.fontFamilyHeadings,
		fontSize: 24,
		fontWeight: '700',
		color: theme.colors.textColor,
		marginBottom: 8,
	},
	heading3: {
		fontFamily: theme.typography.fontFamilyHeadings,
		fontSize: 20,
		fontWeight: '700',
		color: theme.colors.textColor,
		marginBottom: 8,
	},
	heading4: {
		fontFamily: theme.typography.fontFamilyHeadings,
		fontSize: 18,
		fontWeight: '700',
		color: theme.colors.textColor,
		marginBottom: 6,
	},
	heading5: {
		fontFamily: theme.typography.fontFamilyHeadings,
		fontSize: 16,
		fontWeight: '700',
		color: theme.colors.textColor,
		marginBottom: 4,
	},
	heading6: {
		fontFamily: theme.typography.fontFamilyHeadings,
		fontSize: 14,
		fontWeight: '700',
		color: theme.colors.textColor,
		marginBottom: 4,
	},
	bullet_list: {
		marginBottom: 10,
	},
	bullet_list_icon: {
		color: theme.colors.textColor,
		fontFamily: theme.typography.fontFamily,
	},
	bullet_list_content: {
		color: theme.colors.textColor,
	},
	listUnorderedItemIcon: {
		color: theme.colors.textColor,
		fontFamily: theme.typography.fontFamily,
	},
	listUnorderedItemText: {
		color: theme.colors.textColor,
	},
	ordered_list: {
		marginBottom: 10,
	},
	ordered_list_icon: {
		color: theme.colors.textColor,
		fontFamily: theme.typography.fontFamily,
	},
	ordered_list_content: {
		color: theme.colors.textColor,
	},
	listOrderedItemIcon: {
		color: theme.colors.textColor,
		fontFamily: theme.typography.fontFamily,
	},
	listOrderedItemText: {
		color: theme.colors.textColor,
	},
	list_item: {
		marginBottom: 4,
		color: theme.colors.textColor,
	},
	listItem: {
		marginBottom: 4,
	},
	link: {
		color: theme.colors.accentColor,
		textDecorationLine: 'underline',
	},
	blockquote: {
		backgroundColor: theme.colors.bgSecondary,
		borderLeftColor: theme.colors.borderColor,
		borderLeftWidth: 4,
		paddingHorizontal: 12,
		paddingVertical: 8,
		marginBottom: 10,
	},
	code_inline: {
		backgroundColor: theme.colors.bgSecondary,
		borderColor: theme.colors.borderColor,
		borderWidth: 1,
		borderRadius: 6,
		paddingHorizontal: 6,
		paddingVertical: 2,
	},
	code_block: {
		backgroundColor: theme.colors.bgSecondary,
		borderColor: theme.colors.borderColor,
		borderWidth: 1,
		borderRadius: 8,
		padding: 10,
		marginBottom: 10,
	},
	fence: {
		backgroundColor: theme.colors.bgSecondary,
		borderColor: theme.colors.borderColor,
		borderWidth: 1,
		borderRadius: 8,
		padding: 10,
		marginBottom: 10,
	},
});
