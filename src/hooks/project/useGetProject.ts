import { useInfiniteQuery } from '@tanstack/react-query';
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/common/apiEndpoints";
import { projectKeys } from "@/utils/queryKeyFactory";
import { DEFAULT_PAGE, TAKE_PAGE } from "@/consts/query";
import type { IProjectResponse } from '@/types/project';

const defaultQuery = {
  size: TAKE_PAGE,
  name: '',
};

export function useGetProjects(params?: Partial<typeof defaultQuery>) {
  const queryParams = { ...defaultQuery, ...params };
  return useInfiniteQuery({
    queryKey: projectKeys.list(queryParams),
    initialPageParam: DEFAULT_PAGE,
    queryFn: async ({ pageParam = DEFAULT_PAGE }) => {
      const response = await api.get<IProjectResponse>(
        API_ENDPOINTS.GET_PROJECTS,
        {
          params: {
            ...queryParams,
            page: pageParam,
          },
        }
      );
      return response as unknown as IProjectResponse;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined;
    },
  });
}
