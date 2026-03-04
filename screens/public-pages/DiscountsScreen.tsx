import { useDiscountsData } from '@/features/discounts/hook/useDiscountsData';

import { PartnersListScreen } from '@/shared/ui/partners/PartnersListScreen';

export default function DiscountsScreen() {
	const { categories, partners, isLoading, isError, refetch } = useDiscountsData();

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
