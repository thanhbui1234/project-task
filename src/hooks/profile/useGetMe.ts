import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/common/apiEndpoints';
import { profileKeys } from '@/utils/queryKeyFactory';
import { type IFile } from '@/types/file';
import { getToken } from '@/utils/auth';

interface IProfileResponse {
  id: string;
  avatar: IFile;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: string;
}

export function useGetMe() {
  const hasToken = getToken();

  return useQuery<IProfileResponse, Error>({
    queryKey: profileKeys.details('me'),
    queryFn: async () => {
      const response = await api.get<IProfileResponse>(API_ENDPOINTS.GET_ME);
      return response as unknown as IProfileResponse;
    },
    enabled: !!hasToken
  });
}
