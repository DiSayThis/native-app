import { render } from '@testing-library/react-native';

import { PartnerCard } from '../PartnerCard';

type MockExpoImageProps = {
	placeholder?: unknown;
	recyclingKey?: string;
	transition?: number;
};

const mockExpoImage = jest.fn<null, [MockExpoImageProps]>(() => null);

jest.mock('expo-image', () => ({
	Image: (props: unknown) => mockExpoImage(props as MockExpoImageProps),
}));

jest.mock('expo-router', () => ({
	router: {
		push: jest.fn(),
	},
}));

jest.mock('@/features/favorites/hook/usePartnerFavoriteToggle', () => ({
	usePartnerFavoriteToggle: () => ({
		isFavorite: false,
		canToggleFavorite: false,
		isToggling: false,
		toggleFavorite: jest.fn(),
	}),
}));

jest.mock('@/shared/ui/theme/ThemeProvider', () => ({
	useTheme: () => ({
		theme: require('@/shared/styles/tokens').lightTheme,
	}),
}));

describe('PartnerCard', () => {
	beforeEach(() => {
		mockExpoImage.mockClear();
	});

	it('keeps placeholder for image that was not warmed yet', () => {
		render(
			<PartnerCard
				index={0}
				item={{
					id: 'partner-cold',
					heading: 'Cold',
					subtitle: 'Image',
					discount: '10',
					categoryId: 1,
					isFixed: false,
				}}
			/>,
		);

		expect(mockExpoImage).toHaveBeenCalled();
		const props = mockExpoImage.mock.calls[0]?.[0];
		expect(props).toBeDefined();
		expect(props.placeholder).toBeDefined();
		expect(props.transition).toBe(120);
	});

	it('uses a stable recycling key for partner image retries and list reuse', () => {
		render(
			<PartnerCard
				index={0}
				item={{
					id: 'partner-ready',
					heading: 'Ready',
					subtitle: 'Image',
					discount: '15',
					categoryId: 1,
					isFixed: false,
				}}
			/>,
		);

		expect(mockExpoImage).toHaveBeenCalled();
		const props = mockExpoImage.mock.calls[0]?.[0];
		expect(props).toBeDefined();
		expect(props.placeholder).toBeDefined();
		expect(props.recyclingKey).toContain('partner-ready');
	});
});
