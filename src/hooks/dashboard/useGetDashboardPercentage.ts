import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/common/apiEndpoints';
import { dashboardPercentageKeys } from '@/utils/queryKeyFactory';

export interface IDashboardPercentageResponse {

  rightProcessTasksCount: number;
  slowProcessTasksCount: number;
  startedTasksCount: number;
}
export const useGetDashboardPercentage = () => {
  return useQuery<IDashboardPercentageResponse, Error>({
    queryKey: dashboardPercentageKeys.all(),
    queryFn: async () => {
      const response = await api.get<IDashboardPercentageResponse>(
        API_ENDPOINTS.GET_DASHBOARD_PERCENTAGE
      );
      return response as unknown as IDashboardPercentageResponse;
    },
  });
};
