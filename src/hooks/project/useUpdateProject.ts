import { API_ENDPOINTS } from '@/common/apiEndpoints';
import { queryClient } from '@/lib';
import api from '@/lib/axios';
import type { ICreateProjectSchema } from '@/schemas/Project';
import { projectKeys } from '@/utils/queryKeyFactory';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdateProject = () => {
  const { mutate: updateProject, isPending } = useMutation<
    void,
    Error,
    { id: string; data: ICreateProjectSchema }
  >({
    mutationFn: ({ id, data }) =>
      api.put(API_ENDPOINTS.UPDATE_PROJECT, { projectId: id, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all() });
      toast.success('Cập nhật dự án thành công');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { updateProject, isPending };
};
