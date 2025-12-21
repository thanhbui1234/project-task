import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/common/apiEndpoints';
import { DEFAULT_PAGE, TAKE_PAGE } from '@/consts/query';
import type { IEmployeeResponse } from '@/types/employee';

interface GetTasksParams {
  page?: number;
  take?: number;
  order?: string;
  phoneNumber?: string;
  role?: string;
  sort?: string;
  email?: string;
  name?: string;
}

import { employeeKeys } from '@/utils/queryKeyFactory';

export function useGetEmployeesTable({
  page = DEFAULT_PAGE,
  take = TAKE_PAGE,
  order,
  phoneNumber,
  role,
  sort,
  email,
  name,
}: GetTasksParams) {
  const params = { page, take, order, phoneNumber, role, sort, email, name };
  return useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: async (): Promise<IEmployeeResponse> => {
      // Axios interceptor đã return response.data.data
      // Nên response ở đây đã là { docs, meta }
      const response = await api.get(`${API_ENDPOINTS.GET_EMPLOYEES}`, {
        params: {
          page,
          take,
          order,
          phoneNumber,
          role,
          sort,
          email,
          name,
        },
      });

      // Đảm bảo luôn trả về object hợp lệ
      const data = response as unknown as IEmployeeResponse;
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
