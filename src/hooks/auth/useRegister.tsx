import { API_ENDPOINTS } from "@/common/apiEndpoints";
import api from "@/lib/axios";
import type { registerType } from "@/schemas/auth";
import { useMutation } from "@tanstack/react-query";
import Toaster from "@/components/ui/Toaster";
export const useRegister = () => {
  const { mutate: register, isPending } = useMutation<void, Error, registerType, void>({
    mutationFn: (data: registerType) => api.post(API_ENDPOINTS.REGISTER, data),
    onSuccess: () => {
      Toaster({
        type: 'success',
        message: 'Đăng ký thành công',
      })
    },
  });

  return { register, isPending };
};