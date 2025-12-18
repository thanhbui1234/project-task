import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/common/apiEndpoints";
import { queryClient } from "@/lib";
import { profileKeys } from "@/utils/queryKeyFactory";
import { type IProfileSchema } from "@/schemas/Profile";

export const useUpdateProfile = () => {
  return useMutation<void, Error, IProfileSchema>({
    mutationFn: (data) => {
      console.log(data);
      return api.put(API_ENDPOINTS.UPDATE_PROFILE, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.details('me') });
      toast.success('Cập nhật hồ sơ thành công');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};