import { useMutation } from '@tanstack/react-query'
import { normalizeImage } from '@/utils/normalizeImage'
import api from '@/lib/axios'
import { API_ENDPOINTS } from '@/common/apiEndpoints';

interface UploadFileResponse {
  id: string;
  path: string;
  type: string;
  projectId: string | null;
  taskId: string | null;
  createdAt: number;
}

export const useUploadFile = () => {
  return useMutation<UploadFileResponse[], Error, File>({
    mutationFn: async (file: File) => {
      const normalizedFile = await normalizeImage(file)

      const formData = new FormData()
      formData.append('images', normalizedFile)

      return (await api.post(API_ENDPOINTS.UPLOAD_FILE, formData)) as UploadFileResponse[]
    },

    onError: (error) => {
      console.error('Upload failed:', error)
    },
  })
}
