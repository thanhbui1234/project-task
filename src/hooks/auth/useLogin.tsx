import api from "@/lib/axios";
import type { loginType } from "@/schemas/auth";
import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/common/apiEndpoints";
import { toast } from "sonner";
import { auth, setToken } from "@/utils/auth";
import {type UserInfo} from "@/store/useAuthStore";
interface LoginResponse {
  accessToken: string;
  user: UserInfo;
}

export const useLogin = () => {
  const { mutate: login, isPending } = useMutation<LoginResponse, Error, loginType, void>({
    mutationFn: (data: loginType) => api.post(API_ENDPOINTS.LOGIN, data),
    onSuccess: (response: LoginResponse) => {
      setToken(response.accessToken);
      auth.login(response.user);
      toast.success("Đăng nhập thành công");
    },
  });

  return { login, isPending };
};