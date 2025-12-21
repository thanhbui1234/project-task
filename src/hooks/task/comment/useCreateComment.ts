import { API_ENDPOINTS } from '@/common/apiEndpoints';
import api from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { commentKeys } from '@/utils/queryKeyFactory';

interface ICreateComment {
  content: string;
  fileIds: string[];
}
export const useCreateComment = (taskId: string) => {
  const queryClient = useQueryClient();

  const { mutate: createComment, isPending } = useMutation<
    void,
    Error,
    ICreateComment,
    void
  >({
    mutationFn: (data: ICreateComment) => api.post(API_ENDPOINTS.CREATE_COMMENT, { ...data, taskId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.details(taskId) });
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi tạo bình luận');
    },
  });

  return { createComment, isPending };
};
