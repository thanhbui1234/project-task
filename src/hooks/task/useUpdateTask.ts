import { API_ENDPOINTS } from '@/common/apiEndpoints';
import { queryClient } from '@/lib';
import api from '@/lib/axios';
import type { IUpdateTaskSchema } from '@/schemas/Project';
import { taskKeys } from '@/utils/queryKeyFactory';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdateTask = (projectId: string) => {
  const { mutate: updateTask, isPending } = useMutation<
    void,
    Error,
    IUpdateTaskSchema,
    void
  >({
    mutationFn: (data: IUpdateTaskSchema) =>
      api.put(API_ENDPOINTS.UPDATE_TASK, {
        taskId: data.taskId,
        name: data.name,
        description: data.description,
        assignedTo: data.assignedTo,
        status: data.status,
        startAt: data.startAt,
        endAt: data.endAt,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.list({ projectId }) });
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(variables.taskId),
      });
      toast.success('Cập nhật công việc thành công');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { updateTask, isPending };
};
