import { API_ENDPOINTS } from '@/common/apiEndpoints';
import api from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { employeeKeys } from '@/utils/queryKeyFactory';

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteEmployee, isPending } = useMutation<
    void,
    Error,
    { id: string },
    void
  >({
    mutationFn: (data: { id: string }) => api.delete(API_ENDPOINTS.DELETE_EMPLOYEE + '/' + data.id),
    onSuccess: () => {
      toast.success('Xóa nhân viên thành công');
      queryClient.invalidateQueries({ queryKey: employeeKeys.all() });
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi xóa nhân viên');
    },
  });

  return { deleteEmployee, isPending };
};
