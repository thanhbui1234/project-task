import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/common/apiEndpoints';
import { myProjectKeys } from '@/utils/queryKeyFactory';
import { DEFAULT_PAGE, TAKE_PAGE } from '@/consts/query';
import type { ITaskResponse } from '@/types/task';

interface GetTasksParams {
  page?: number;
  take?: number;
  userId?: any;
}

export function useGetMyProject({
  page = DEFAULT_PAGE,
  take = TAKE_PAGE,
  userId,
}: GetTasksParams) {
  return useQuery({
    queryKey: myProjectKeys.list({ page, take }),
    queryFn: async (): Promise<ITaskResponse> => {
      // Axios interceptor đã return response.data.data
      // Nên response ở đây đã là { docs, meta }
      const response = await api.get(`${API_ENDPOINTS.GET_SLOW_PROJECT}`, {
        params: {
          page,
          take,
          userId: userId,
        },
      });

      // Đảm bảo luôn trả về object hợp lệ
      const data = response as unknown as ITaskResponse;
      return {
        docs: data?.docs ?? [],
        meta: data?.meta ?? {
          page: 1,
          take: TAKE_PAGE,
          total: 0,
          totalPage: 1,
          hasPreviousPage: false,
          hasNextPage: false,
        },
      };
    },
    enabled: true,
  });
}
