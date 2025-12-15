import { useQuery } from '@tanstack/react-query';
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/common/apiEndpoints";
import { taskKeys } from "@/utils/queryKeyFactory";
import { DEFAULT_PAGE, TAKE_PAGE } from "@/consts/query";
import type { ITaskResponse } from '@/types/task';

interface GetTasksParams {
  projectId: string;
  page?: number;
  take?: number;
}

export function useGetTasks({ projectId, page = DEFAULT_PAGE, take = TAKE_PAGE }: GetTasksParams) {
  return useQuery({
    queryKey: taskKeys.list({ projectId, page, take }),
    queryFn: async (): Promise<ITaskResponse> => {
      // Axios interceptor đã return response.data.data
      // Nên response ở đây đã là { docs, meta }
      const response = await api.get(
        `${API_ENDPOINTS.CREATE_TASK}`,
        {
          params: {
            projectId,
            page,
            take,
          },
        }
      );
      
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
    enabled: !!projectId,
  });
}
