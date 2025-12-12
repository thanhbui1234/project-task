import { API_ENDPOINTS } from "@/common/apiEndpoints";
import { queryClient } from "@/lib";
import api from "@/lib/axios";
import { projectKeys } from "@/utils/queryKeyFactory";
import { useMutation } from "@tanstack/react-query";
import Toaster from "@/components/ui/Toaster";
export const useDeleteProject = () => {
  const { mutate: deleteProject, isPending } = useMutation<void, Error, { id: string }>({
    mutationFn: (data: { id: string }) => api.delete(`${API_ENDPOINTS.DELETE_PROJECT}/${data.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all() });
      Toaster({
        type: 'success',
        message: 'Xóa dự án thành công',
      })
    },
  });

  return { deleteProject, isPending };
};