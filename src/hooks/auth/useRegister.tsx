import { API_ENDPOINTS } from "@/common/apiEndpoints";
import api from "@/lib/axios";
import type { registerType } from "@/schemas/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
export const useRegister = () => {
  const { mutate: register, isPending } = useMutation<void, Error, registerType, void>({
    mutationFn: (data: registerType) => api.post(API_ENDPOINTS.REGISTER, data),
    onSuccess: () => {
        console.log('vao day')
      toast.success("Đăng ký thành công");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { register, isPending };
};