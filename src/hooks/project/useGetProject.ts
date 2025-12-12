import { useQuery } from '@tanstack/react-query';
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/common/apiEndpoints";
import { projectKeys } from "@/utils/queryKeyFactory";
import { DEFAULT_PAGE, TAKE_PAGE } from "@/consts/query";
import type { IProjectResponse } from '@/types/project';

const defaultQuery = {
  page: DEFAULT_PAGE,
  size: TAKE_PAGE,
  searchKey: '',
};


export function useGetProjects() {
  return useQuery({
    queryKey: projectKeys.all(),
    queryFn: async () => {
      const response = await api.get<IProjectResponse>(
        API_ENDPOINTS.GET_PROJECTS,
        {
          params: defaultQuery,
        }
      );
      return response as unknown as IProjectResponse;
    },
  });
}
