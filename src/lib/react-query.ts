// src/lib/queryClient.ts
import { handleCommonError } from '@/utils/handleError';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (/* error */) => {
      // Uncomment if you want global error handling for queries
      // handleCommonError(error);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      console.log(error, 'error111');
      // Only handle error if the mutation hasn't handled it itself (optional check)
      // For now, enforcing global error handling:
      if (mutation.options.onError) return;
      handleCommonError(error);
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5,
      refetchOnReconnect: true,
      refetchOnMount: false,
    },
  },
});
