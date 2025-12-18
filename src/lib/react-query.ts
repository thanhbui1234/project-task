// src/lib/queryClient.ts
import { handleCommonError } from '@/utils/handleError';
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5,
      refetchOnReconnect: true,
      refetchOnMount: false,
    },
    mutations: {
      onError: (error: unknown) => {
        handleCommonError(error);
      },
    },
  },
});
