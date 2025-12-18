import { API_ENDPOINTS } from '@/common/apiEndpoints';
import { queryClient } from '@/lib';
import api from '@/lib/axios';
import { taskKeys } from '@/utils/queryKeyFactory';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useDeleteTask = (projectId: string) => {
  const { mutate: deleteTask, isPending } = useMutation<
    void,
    Error,
    { id: string }
  >({
    mutationFn: (data: { id: string }) =>
      api.delete(API_ENDPOINTS.DELETE_TASK + '/' + projectId + '/' + data.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.list({ projectId }) });
      toast.success('Xóa công việc thành công');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { deleteTask, isPending };
};
