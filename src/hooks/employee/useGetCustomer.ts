import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/common/apiEndpoints';
import { customersKeys } from '@/utils/queryKeyFactory';
import type { IEmployeeResponse } from '@/types/employee';

export const useGetCustomer = () => {
  return useQuery<IEmployeeResponse, Error>({
    queryKey: customersKeys.all(),
    queryFn: async () => {
      const response = await api.get<IEmployeeResponse>(
        API_ENDPOINTS.GET_EMPLOYEES, {
        params: {
          role: 'Customer'
        }
      }
      );
      return response as unknown as IEmployeeResponse;
    },
  });
};
