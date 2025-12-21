import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/common/apiEndpoints';
import { commentKeys } from '@/utils/queryKeyFactory';

export const useGetComments = (taskId: string) => {
  return useQuery({
    queryKey: commentKeys.details(taskId),
    queryFn: async () => {
      const response = await api.get(
        API_ENDPOINTS.GET_COMMENTS, {
        params: {
          taskId: taskId
        }
      }
      );
      return response as any;
    },
    enabled: !!taskId,
  });
};
