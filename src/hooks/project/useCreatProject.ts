import { API_ENDPOINTS } from "@/common/apiEndpoints";
import { queryClient } from "@/lib";
import api from "@/lib/axios";
import type { registerType } from "@/schemas/auth";
import { projectKeys } from "@/utils/queryKeyFactory";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
export const useCreatProject = () => {
  const { mutate: createProject, isPending } = useMutation<void, Error, registerType, void>({
    mutationFn: (data: registerType) => api.post(API_ENDPOINTS.CREATE_PROJECT, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all() });
      toast.success("Tạo dự án thành công");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { createProject, isPending };
};