import { API_ENDPOINTS } from '@/common/apiEndpoints';
import { queryClient } from '@/lib';
import api from '@/lib/axios';
import type { IUpdateTaskSchema } from '@/schemas/Project';
import { projectKeys, taskKeys } from '@/utils/queryKeyFactory';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { taskDetailKeys } from '@/utils/queryKeyFactory';

export const useUpdateTask = (projectId?: string) => {
  const { mutate: updateTask, isPending } = useMutation<
    void,
    Error,
    Partial<IUpdateTaskSchema> & { taskId: string; projectId?: string },
    void
  >({
    mutationFn: (data) =>
      api.put(API_ENDPOINTS.UPDATE_TASK, {
        projectId: data.projectId || projectId,
        ...data,
      }),
    onSuccess: (_, variables) => {
      const pId = variables.projectId || projectId;
      // Invalidate all field queries related to tasks to ensure lists with pagination (which include page/take params) are refreshed
      queryClient.invalidateQueries({ queryKey: taskKeys.all() });
      queryClient.invalidateQueries({
        queryKey: taskDetailKeys.details(variables.taskId),
      });
      if (pId) {
        queryClient.refetchQueries({
          queryKey: projectKeys.details(pId),
        });
      }
      toast.success('Cập nhật công việc thành công');
    },
  });

  return { updateTask, isPending };
};

