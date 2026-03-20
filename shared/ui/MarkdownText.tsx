import { useMemo } from 'react';

import { Linking } from 'react-native';

import Markdown, { MarkdownIt, type MarkdownProps } from 'react-native-markdown-renderer';

import { lightTheme } from '@/shared/styles/tokens';

type MarkdownTextProps = {
	content?: string | null;
	style?: MarkdownProps['style'];
};

const markdownIt = new MarkdownIt({
	breaks: true,
	linkify: true,
	typographer: true,
});

const baseMarkdownStyle: MarkdownProps['style'] = {
	body: {
		color: lightTheme.colors.textColor,
		fontFamily: lightTheme.typography.fontFamily,
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
		color: lightTheme.colors.textColor,
		fontFamily: lightTheme.typography.fontFamily,
		fontSize: 16,
		lineHeight: 22,
	},
	heading1: {
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: 28,
		fontWeight: '700',
		color: lightTheme.colors.textColor,
		marginBottom: 10,
	},
	heading2: {
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: 24,
		fontWeight: '700',
		color: lightTheme.colors.textColor,
		marginBottom: 8,
	},
	heading3: {
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: 20,
		fontWeight: '700',
		color: lightTheme.colors.textColor,
		marginBottom: 8,
	},
	heading4: {
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: 18,
		fontWeight: '700',
		color: lightTheme.colors.textColor,
		marginBottom: 6,
	},
	heading5: {
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: 16,
		fontWeight: '700',
		color: lightTheme.colors.textColor,
		marginBottom: 4,
	},
	heading6: {
		fontFamily: lightTheme.typography.fontFamilyHeadings,
		fontSize: 14,
		fontWeight: '700',
		color: lightTheme.colors.textColor,
		marginBottom: 4,
	},
	bullet_list: {
		marginBottom: 10,
	},
	ordered_list: {
		marginBottom: 10,
	},
	list_item: {
		marginBottom: 4,
	},
	link: {
		color: lightTheme.colors.accentHoverTextColor,
		textDecorationLine: 'underline',
	},
	blockquote: {
		backgroundColor: lightTheme.colors.bgSecondary,
		borderLeftColor: lightTheme.colors.borderColor,
		borderLeftWidth: 4,
		paddingHorizontal: 12,
		paddingVertical: 8,
		marginBottom: 10,
	},
	code_inline: {
		backgroundColor: lightTheme.colors.bgSecondary,
		borderColor: lightTheme.colors.borderColor,
		borderWidth: 1,
		borderRadius: 6,
		paddingHorizontal: 6,
		paddingVertical: 2,
	},
	code_block: {
		backgroundColor: lightTheme.colors.bgSecondary,
		borderColor: lightTheme.colors.borderColor,
		borderWidth: 1,
		borderRadius: 8,
		padding: 10,
		marginBottom: 10,
	},
	fence: {
		backgroundColor: lightTheme.colors.bgSecondary,
		borderColor: lightTheme.colors.borderColor,
		borderWidth: 1,
		borderRadius: 8,
		padding: 10,
		marginBottom: 10,
	},
};

export default function MarkdownText({ content, style }: MarkdownTextProps) {
	const normalizedContent = content?.trim();
	const markdownStyle = useMemo(
		() => (style ? { ...baseMarkdownStyle, ...style } : baseMarkdownStyle),
		[style],
	);

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
