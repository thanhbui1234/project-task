import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/common/apiEndpoints';
import { dashboardKeys } from '@/utils/queryKeyFactory';

export interface IDashboardResponse {
  completeTasksCount: number;
  openTasksCount: number;
  runningProjectsCount: number;
  usersCount: number;
}
export const useGetDashboard = () => {
  return useQuery<IDashboardResponse, Error>({
    queryKey: dashboardKeys.all(),
    queryFn: async () => {
      const response = await api.get<IDashboardResponse>(
        API_ENDPOINTS.GET_DASHBOARD
      );
      return response as unknown as IDashboardResponse;
    },
  });
};
