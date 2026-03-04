import { useMemo } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import { authAtom } from '@/entities/auth/model/auth.store';

import RolesEnum from '@/shared/constants/rolesEnum';

import {
	addToFavoritePartner,
	deleteFavoritePartner,
	getFavoritePartnersQuery,
} from '../api/favorites.api';
import { favoritesQueryKeys } from '../model/favorites.query-keys';

type UsePartnerFavoriteToggleOptions = {
	partnerId: string;
};

export function usePartnerFavoriteToggle({ partnerId }: UsePartnerFavoriteToggleOptions) {
	const { id: studentId, role } = useAtomValue(authAtom);
	const queryClient = useQueryClient();
	const canToggleFavorite = Boolean(studentId && role === RolesEnum.STUDENT);

	const favoritesQuery = useQuery({
		queryKey: favoritesQueryKeys.partners(studentId ?? ''),
		queryFn: () => getFavoritePartnersQuery(studentId ?? ''),
		enabled: Boolean(studentId),
	});

	const isFavorite = useMemo(
		() => (favoritesQuery.data ?? []).some((partner) => partner.id === partnerId),
		[favoritesQuery.data, partnerId],
	);

	const addMutation = useMutation({
		mutationFn: () => addToFavoritePartner(partnerId, studentId ?? ''),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: favoritesQueryKeys.partners(studentId ?? ''),
			});
		},
	});

	const removeMutation = useMutation({
		mutationFn: () => deleteFavoritePartner(partnerId, studentId ?? ''),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: favoritesQueryKeys.partners(studentId ?? ''),
			});
		},
	});

	const toggleFavorite = async () => {
		if (!canToggleFavorite || addMutation.isPending || removeMutation.isPending) {
			return;
		}

		if (isFavorite) {
			await removeMutation.mutateAsync();
			return;
		}

		await addMutation.mutateAsync();
	};

	return {
		isFavorite,
		canToggleFavorite,
		isToggling: addMutation.isPending || removeMutation.isPending,
		toggleFavorite,
	};
}
