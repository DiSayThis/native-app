import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryClientWrapper, createTestQueryClient } from '@/shared/test/render-hook';

import { getUserCitiesQuery, getUserCoursesQuery, getUserUniversitiesQuery } from '../api/query';
import { userQueryKeys } from '../model/user.query-keys';

import { useUserProfileFormDictionaries } from './useUserProfileFormDictionaries';

jest.mock('../api/query', () => ({
	getUserUniversitiesQuery: jest.fn(),
	getUserCoursesQuery: jest.fn(),
	getUserCitiesQuery: jest.fn(),
}));

const mockedGetUserUniversitiesQuery = jest.mocked(getUserUniversitiesQuery);
const mockedGetUserCoursesQuery = jest.mocked(getUserCoursesQuery);
const mockedGetUserCitiesQuery = jest.mocked(getUserCitiesQuery);

describe('useUserProfileFormDictionaries', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('loads universities and courses immediately, but defers cities until region exists', async () => {
		mockedGetUserUniversitiesQuery.mockResolvedValue([{ id: 1, name: 'MSU' }] as any);
		mockedGetUserCoursesQuery.mockResolvedValue([{ id: 2, name: 'Course 4' }] as any);
		mockedGetUserCitiesQuery.mockResolvedValue([{ id: 3, name: 'Moscow' }] as any);

		const queryClient = createTestQueryClient();
		const wrapper = createQueryClientWrapper(queryClient);
		const withoutRegion = renderHook(() => useUserProfileFormDictionaries(), { wrapper });

		await waitFor(() => {
			expect(withoutRegion.result.current.universitiesQuery.data).toEqual([{ id: 1, name: 'MSU' }]);
		});
		await waitFor(() => {
			expect(withoutRegion.result.current.coursesQuery.data).toEqual([{ id: 2, name: 'Course 4' }]);
		});

		expect(mockedGetUserCitiesQuery).not.toHaveBeenCalled();
		expect(queryClient.getQueryData(userQueryKeys.universities())).toEqual([
			{ id: 1, name: 'MSU' },
		]);
		expect(queryClient.getQueryData(userQueryKeys.courses())).toEqual([
			{ id: 2, name: 'Course 4' },
		]);

		const withRegion = renderHook(
			() => useUserProfileFormDictionaries({ regionId: 77, enabled: true }),
			{ wrapper },
		);

		await waitFor(() => {
			expect(withRegion.result.current.citiesQuery.data).toEqual([{ id: 3, name: 'Moscow' }]);
		});
		expect(mockedGetUserCitiesQuery).toHaveBeenCalledWith(77);
		expect(queryClient.getQueryData(userQueryKeys.cities(77))).toEqual([{ id: 3, name: 'Moscow' }]);
	});

	it('keeps all queries idle when dictionaries are disabled', () => {
		const wrapper = createQueryClientWrapper();
		const { result } = renderHook(
			() => useUserProfileFormDictionaries({ regionId: 10, enabled: false }),
			{ wrapper },
		);

		expect(result.current.universitiesQuery.fetchStatus).toBe('idle');
		expect(result.current.coursesQuery.fetchStatus).toBe('idle');
		expect(result.current.citiesQuery.fetchStatus).toBe('idle');
	});
});
