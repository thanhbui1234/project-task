import { API_ENDPOINTS } from '@/common/apiEndpoints';
import { queryClient } from '@/lib';
import api from '@/lib/axios';
import type { ICreateTaskSchema } from '@/schemas/Project';
import { taskKeys } from '@/utils/queryKeyFactory';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreatTask = (projectId: string) => {
  const { mutate: createTask, isPending } = useMutation<
    void,
    Error,
    ICreateTaskSchema,
    void
  >({
    mutationFn: (data: ICreateTaskSchema) =>
      api.post(API_ENDPOINTS.CREATE_TASK, { projectId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.list({ projectId }) });
      toast.success('Tạo công việc thành công');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { createTask, isPending };
};
