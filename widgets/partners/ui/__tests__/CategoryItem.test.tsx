import { render, screen } from '@testing-library/react-native';

import { CategoryItem } from '../CategoryItem';
import * as mockCategoryIconCache from '../category-icon-cache';

jest.mock('../category-icon-cache', () => ({
	getCategoryIconType: jest.fn(),
	getCachedSvgXml: jest.fn(),
	isRasterIconReady: jest.fn(),
	isSvgXmlDocument: jest.fn(),
	markRasterIconReady: jest.fn(),
	resolveSvgXml: jest.fn(),
	warmCategoryIcon: jest.fn(),
}));

jest.mock('@/shared/ui/theme/ThemeProvider', () => ({
	useTheme: () => ({
		theme: require('@/shared/styles/tokens').lightTheme,
	}),
}));

describe('CategoryItem', () => {
	beforeEach(() => {
		jest.mocked(mockCategoryIconCache.getCategoryIconType).mockReturnValue('raster');
		jest.mocked(mockCategoryIconCache.getCachedSvgXml).mockReturnValue(null);
		jest.mocked(mockCategoryIconCache.isSvgXmlDocument).mockReturnValue(false);
		jest.mocked(mockCategoryIconCache.resolveSvgXml).mockResolvedValue(null);
		jest.mocked(mockCategoryIconCache.warmCategoryIcon).mockResolvedValue(undefined);
		jest.mocked(mockCategoryIconCache.markRasterIconReady).mockReset();
	});

	it('shows placeholder while raster icon is still cold', () => {
		jest.mocked(mockCategoryIconCache.isRasterIconReady).mockReturnValue(false);

		render(
			<CategoryItem
				item={{ id: 1, name: 'Food', IconUrl: 'https://example.com/icon.png' }}
				isSelected={false}
				onPress={jest.fn()}
			/>,
		);

		expect(screen.getByTestId('category-icon-placeholder')).toBeTruthy();
	});

	it('does not show placeholder for warmed raster icon', () => {
		jest.mocked(mockCategoryIconCache.isRasterIconReady).mockReturnValue(true);

		render(
			<CategoryItem
				item={{ id: 2, name: 'Books', IconUrl: 'https://example.com/ready.png' }}
				isSelected={false}
				onPress={jest.fn()}
			/>,
		);

		expect(screen.queryByTestId('category-icon-placeholder')).toBeNull();
	});
});
