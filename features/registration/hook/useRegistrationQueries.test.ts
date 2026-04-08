import { useMutation, useQuery } from '@tanstack/react-query';

import {
	getCheckEmailDomainsQuery,
	getCourseQuery,
	getStudentByEmailQuery,
	getUniversitiesQuery,
	registerStudentQuery,
} from '../api/registration.api';
import { registrationQueryKeys } from '../model/registration.query-keys';

import {
	useCheckEmailDomains,
	useCourseQuery,
	useEmailCheck,
	useRegistrationMutation,
	useUniversityQuery,
} from './useRegistrationQueries';

jest.mock('@tanstack/react-query', () => ({
	useQuery: jest.fn(),
	useMutation: jest.fn(),
}));

jest.mock('../api/registration.api', () => ({
	getStudentByEmailQuery: jest.fn(),
	getUniversitiesQuery: jest.fn(),
	getCourseQuery: jest.fn(),
	getCheckEmailDomainsQuery: jest.fn(),
	registerStudentQuery: jest.fn(),
}));

const mockedUseQuery = jest.mocked(useQuery);
const mockedUseMutation = jest.mocked(useMutation);
const mockedGetCheckEmailDomainsQuery = jest.mocked(getCheckEmailDomainsQuery);
const mockedRegisterStudentQuery = jest.mocked(registerStudentQuery);

describe('useRegistrationQueries', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockedUseQuery.mockReturnValue({ data: undefined } as any);
		mockedUseMutation.mockImplementation((config: any) => config as any);
	});

	it('configures email check as an opt-in query', () => {
		useEmailCheck('student@example.com');

		expect(mockedUseQuery).toHaveBeenCalledWith(
			expect.objectContaining({
				queryKey: registrationQueryKeys.emailCheck('student@example.com'),
				queryFn: expect.any(Function),
				retry: false,
				enabled: false,
			}),
		);

		const config = mockedUseQuery.mock.calls[0][0] as any;
		config.queryFn();
		expect(getStudentByEmailQuery).toHaveBeenCalledWith('student@example.com');
	});

	it('configures universities and courses queries with expected keys', () => {
		useUniversityQuery();
		useCourseQuery(false);

		expect(mockedUseQuery).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({
				queryKey: registrationQueryKeys.universities(),
				queryFn: getUniversitiesQuery,
				enabled: true,
			}),
		);
		expect(mockedUseQuery).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				queryKey: registrationQueryKeys.courses(),
				queryFn: getCourseQuery,
				enabled: false,
			}),
		);
	});

	it('returns false from domain check mutation when params are incomplete', async () => {
		const mutation = useCheckEmailDomains() as any;

		await expect(mutation.mutationFn({ email: undefined, universityId: 1 })).resolves.toBe(false);
		await expect(
			mutation.mutationFn({ email: 'student@example.com', universityId: undefined }),
		).resolves.toBe(false);
		expect(mockedGetCheckEmailDomainsQuery).not.toHaveBeenCalled();
	});

	it('passes valid params to domain check and registration mutations', async () => {
		mockedGetCheckEmailDomainsQuery.mockResolvedValue(true);
		mockedRegisterStudentQuery.mockResolvedValue({ ok: true } as any);

		const domainMutation = useCheckEmailDomains() as any;
		const registrationMutation = useRegistrationMutation() as any;
		const payload = {
			email: 'student@example.com',
			password: 'Password1!',
			confirmPassword: 'Password1!',
			promocode: '',
			firstName: 'Иван',
			lastName: 'Иванов',
			specialisation: 'Математика',
			birthDate: '2000-01-01',
			sex: true,
			courseId: 1,
			universityId: 2,
			consent: true,
			file: null,
		};

		await expect(
			domainMutation.mutationFn({
				email: payload.email,
				universityId: payload.universityId,
			}),
		).resolves.toBe(true);
		await expect(registrationMutation.mutationFn(payload)).resolves.toEqual({ ok: true });

		expect(mockedGetCheckEmailDomainsQuery).toHaveBeenCalledWith('student@example.com', 2);
		expect(mockedRegisterStudentQuery).toHaveBeenCalledWith(payload);
	});
});
