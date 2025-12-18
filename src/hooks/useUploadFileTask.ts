import { useMutation } from '@tanstack/react-query'

import api from '@/lib/axios'
import { API_ENDPOINTS } from '@/common/apiEndpoints';
import { taskDetailKeys } from '@/utils/queryKeyFactory';
import { queryClient } from '@/lib';
interface UploadFileResponse {
  id: string;
  path: string;
  type: string;
  projectId: string | null;
  taskId: string | null;
  createdAt: number;
}

export const useUploadFileTask = (taskId: string) => {
  return useMutation<UploadFileResponse[], Error, { projectId: string; taskId: string; fileIds: string[] }>({
    mutationFn: async (data: { projectId: string; taskId: string; fileIds: string[] }) => {
      return (await api.post(API_ENDPOINTS.UPLOAD_FILE_TASK, data)) as UploadFileResponse[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskDetailKeys.details(taskId) });
    },

    onError: (error) => {
      console.error('Upload failed:', error);
    },
  });
};
