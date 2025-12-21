import { projectKeys } from '@/utils/queryKeyFactory';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/common/apiEndpoints';

interface IProjectDetailResponse {
  id: string;
  name: string;
  client: string;
  status: string;
  taskCount: number;
  createdAt: number;
  startAt: number | null;
  endAt: number | null;
  startedCount: number;
  acceptedCount: number;
  inProgressCount: number;
  completedCount: number;
  owner?: string;
}
export const useGetProjectDetail = (id: string) => {
  return useQuery<IProjectDetailResponse, Error>({
    queryKey: projectKeys.details(id),
    queryFn: async () => {
      const response = await api.get(
        API_ENDPOINTS.GET_PROJECT_DETAIL + '/' + id
      );
      return response as unknown as IProjectDetailResponse;
    },
    enabled: !!id,
  });
};
