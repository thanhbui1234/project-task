// import { useInfiniteQuery } from '@tanstack/react-query';
// import api from "@/lib/axios";
// import { API_ENDPOINTS } from "@/common/apiEndpoints";
// import { employeeKeys } from "@/utils/queryKeyFactory";
// import { DEFAULT_PAGE, TAKE_PAGE } from "@/consts/query";
// import type { IEmployee } from '@/types/employee';

// const defaultQuery = {
//   size: TAKE_PAGE,
// };

// export function useGetEmployees(params?: Partial<typeof defaultQuery>) {
//   const queryParams = { ...defaultQuery, ...params };
//   return useInfiniteQuery({
//     queryKey: employeeKeys.list(queryParams),
//     initialPageParam: DEFAULT_PAGE,
//     queryFn: async ({ pageParam = DEFAULT_PAGE }) => {
//       const response = await api.get<IEmployee[]>(
//         API_ENDPOINTS.GET_EMPLOYEES,
//         {
//           params: {
//             ...queryParams,
//             page: pageParam,
//           },
//         }
//       );
//       return response as unknown as IEmployee;
//     },
//     getNextPageParam: (lastPage) => {
//       return lastPage.length > TAKE_PAGE ? lastPage.length + TAKE_PAGE : undefined;
//     },
//   });
// }
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/common/apiEndpoints';
import { employeeKeys } from '@/utils/queryKeyFactory';
import type {  IEmployeeResponse } from '@/types/employee';

export const useGetEmployee = () => {
  return useQuery<IEmployeeResponse, Error>({
    queryKey: employeeKeys.all(),
    queryFn: async () => {
      const response = await api.get<IEmployeeResponse>(API_ENDPOINTS.GET_EMPLOYEES);
      return response as unknown as IEmployeeResponse;
    },
  });
};