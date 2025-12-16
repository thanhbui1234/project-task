import { API_ENDPOINTS } from '@/common/apiEndpoints';
import { queryClient } from '@/lib';
import api from '@/lib/axios';
import { projectKeys } from '@/utils/queryKeyFactory';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
export const useDeleteProject = () => {
  const { mutate: deleteProject, isPending } = useMutation<
    void,
    Error,
    { id: string }
  >({
    mutationFn: (data: { id: string }) =>
      api.delete(API_ENDPOINTS.DELETE_PROJECT + '/' + data.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all() });
      toast.success('Xóa dự án thành công');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { deleteProject, isPending };
};
