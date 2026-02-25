import { useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface IQueryProviderProps {
	children: React.ReactNode;
}

export function QueryProvider({ children }: IQueryProviderProps) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						retry: 1,
						refetchOnWindowFocus: false,
					},
				},
			}),
	);

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
