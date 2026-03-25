import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateUserProfileQuery, uploadUserAvatarQuery } from '../api/query';
import type { IUserAvatarUploadPayload, IUserProfileUpdatePayload } from '../model/user.dto';
import { userQueryKeys } from '../model/user.query-keys';

export function useUserProfileMutations(studentId?: string | null) {
	const queryClient = useQueryClient();

	const invalidateProfileQuery = () =>
		queryClient.invalidateQueries({
			queryKey: userQueryKeys.profile(studentId),
		});

	const updateProfile = useMutation({
		mutationFn: (payload: IUserProfileUpdatePayload) =>
			updateUserProfileQuery(studentId ?? '', payload),
		onSuccess: () => {
			void invalidateProfileQuery();
		},
	});

	const uploadAvatar = useMutation({
		mutationFn: (payload: IUserAvatarUploadPayload) => uploadUserAvatarQuery(payload),
		onSuccess: () => {
			void invalidateProfileQuery();
		},
	});

	return {
		updateProfile,
		uploadAvatar,
	};
}
