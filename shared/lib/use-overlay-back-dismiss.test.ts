import { BackHandler } from 'react-native';

import { renderHook } from '@testing-library/react-native';

import { useOverlayBackDismiss } from './use-overlay-back-dismiss';

const mockAddListener = jest.fn();
const mockUseNavigation = jest.fn();

jest.mock('react-native', () => {
	const actual = jest.requireActual('react-native');

	return {
		...actual,
		BackHandler: {
			addEventListener: jest.fn((...args: unknown[]) => mockAddListener(...args)),
		},
	};
});

jest.mock('@react-navigation/native', () => {
	const React = jest.requireActual('react');

	return {
		useNavigation: () => mockUseNavigation(),
		useFocusEffect: (effect: () => void | (() => void)) => {
			React.useEffect(() => effect(), [effect]);
		},
	};
});

describe('useOverlayBackDismiss', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('intercepts hardware back and closes the overlay first', () => {
		const onDismiss = jest.fn();
		const removeBackListener = jest.fn();
		const unsubscribeBeforeRemove = jest.fn();

		mockUseNavigation.mockReturnValue({
			addListener: jest.fn(() => unsubscribeBeforeRemove),
		});
		mockAddListener.mockReturnValue({
			remove: removeBackListener,
		});

		renderHook(() =>
			useOverlayBackDismiss({
				enabled: true,
				onDismiss,
			}),
		);

		const [, hardwareBackHandler] = mockAddListener.mock.calls[0] as unknown as [
			string,
			() => boolean,
		];

		expect(hardwareBackHandler()).toBe(true);
		expect(onDismiss).toHaveBeenCalledTimes(1);
	});

	it('prevents screen removal on navigation back gestures', () => {
		const onDismiss = jest.fn();
		const removeBackListener = jest.fn();
		const unsubscribeBeforeRemove = jest.fn();
		const addListener = jest.fn(() => unsubscribeBeforeRemove);
		const preventDefault = jest.fn();

		mockUseNavigation.mockReturnValue({ addListener });
		mockAddListener.mockReturnValue({
			remove: removeBackListener,
		});

		renderHook(() =>
			useOverlayBackDismiss({
				enabled: true,
				onDismiss,
			}),
		);

		const [, beforeRemoveHandler] = addListener.mock.calls[0] as unknown as [
			string,
			(event: { preventDefault: () => void }) => void,
		];

		beforeRemoveHandler({ preventDefault });

		expect(preventDefault).toHaveBeenCalledTimes(1);
		expect(onDismiss).toHaveBeenCalledTimes(1);
		expect(BackHandler.addEventListener).toHaveBeenCalledWith(
			'hardwareBackPress',
			expect.any(Function),
		);
	});

	it('does not subscribe when the overlay is closed', () => {
		const onDismiss = jest.fn();

		renderHook(() =>
			useOverlayBackDismiss({
				enabled: false,
				onDismiss,
			}),
		);

		expect(mockAddListener).not.toHaveBeenCalled();
		expect(mockUseNavigation).toHaveBeenCalledTimes(1);
	});
});
