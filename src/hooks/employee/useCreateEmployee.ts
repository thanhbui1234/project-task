import { API_ENDPOINTS } from '@/common/apiEndpoints';
import api from '@/lib/axios';
import type { createMemberType } from '@/schemas/employee';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { employeeKeys } from '@/utils/queryKeyFactory';

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  const { mutate: createEmployee, isPending } = useMutation<
    void,
    Error,
    createMemberType,
    void
  >({
    mutationFn: (data: createMemberType) => api.post(API_ENDPOINTS.REGISTER, data),
    onSuccess: () => {
      toast.success('Tạo nhân viên thành công');
      queryClient.refetchQueries({ queryKey: employeeKeys.all() });
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi tạo nhân viên');
    },
  });

  return { createEmployee, isPending };
};
