import { useAtomValue } from 'jotai';

import { PartnersListScreen } from '@/widgets/partners';

import { useFavoritesData } from '@/features/favorites/hook/useFavoritesData';

import { authAtom } from '@/entities/auth/model/auth.store';

export default function FavoritesPage() {
	const { id: studentId } = useAtomValue(authAtom);
	const { partners, isLoading, isError, refetch } = useFavoritesData(studentId);

	return (
		<PartnersListScreen
			hideCategories
			data={{
				title: 'Избранное',
				searchPlaceholder: 'Поиск по избранному',
				emptyText: 'Список избранного пока пуст',
				errorText: 'Не удалось загрузить избранное',
				partners,
				isLoading,
				isError,
				onRetry: refetch,
			}}
		/>
	);
}
