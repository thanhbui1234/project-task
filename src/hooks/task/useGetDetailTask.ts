import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/common/apiEndpoints';
import { taskDetailKeys } from '@/utils/queryKeyFactory';

interface GetDetailTaskParams {
  taskId: string;
}
interface ITaskDetailResponse {
  id: string;
  name: string;
  status: string;
  description: string;
  assignedTo: string | null;
  projectId: string;
  startAt: string | null;
  endAt: string | null;
  priority: string;
}

export function useGetDetailTask({ taskId }: GetDetailTaskParams) {
  return useQuery({
    queryKey: taskDetailKeys.details(taskId),
    queryFn: async (): Promise<ITaskDetailResponse> => {
      const response = await api.get(
        `${API_ENDPOINTS.GET_TASK_DETAIL}/${taskId}`
      );
      return response as unknown as ITaskDetailResponse;
    },
  });
}
