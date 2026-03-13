import { PartnersListScreen } from '@/widgets/partners';

import { usePartnersCardsData } from '@/features/partners-cards/hook/usePartnersCardsData';

export default function DiscountsPage() {
	const { categories, partners, isLoading, isError, refetch } = usePartnersCardsData();

	return (
		<PartnersListScreen
			data={{
				title: 'Студмарт',
				searchPlaceholder: 'Поиск по партнерам',
				emptyText: 'По вашему запросу ничего не найдено',
				errorText: 'Не удалось загрузить скидки',
				partners,
				categories,
				isLoading,
				isError,
				onRetry: refetch,
			}}
		/>
	);
}
