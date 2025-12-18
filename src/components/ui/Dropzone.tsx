'use client';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/shadcn-io/dropzone';
import { useUploadFileTask } from '@/hooks/useUploadFileTask';
import { useUploadFile } from '@/hooks/useUploadFile';
import { useState } from 'react';
import { toast } from 'sonner';

interface DropzoneComponentProps {
  onUploadSuccess?: (fileIds: string[]) => void;
  projectId?: string;
  taskId?: string;
}

const DropzoneComponent = ({ onUploadSuccess, projectId, taskId }: DropzoneComponentProps) => {
  const [files, setFiles] = useState<File[] | undefined>();
  const { mutate: uploadFile, isPending: isUploading } = useUploadFile();
  const { mutate: addFilesToTask, isPending: isAdding } = useUploadFileTask(taskId || '');

  const handleDrop = (files: File[]) => {
    setFiles(files);

    uploadFile(files, {
      onSuccess: (data) => {
        const fileIds = data.map((item) => item.id);

        if (projectId && taskId) {
          addFilesToTask(
            { projectId, taskId, fileIds },
            {
              onSuccess: () => {
                toast.success(`Đã tải lên và liên kết ${data.length} tệp tin`);
                if (onUploadSuccess) {
                  onUploadSuccess(fileIds);
                }
              },
              onError: () => {
                toast.error('Liên kết tệp tin thất bại');
              }
            }
          );
        } else {
          toast.success(`Đã tải lên ${data.length} tệp tin`);
          if (onUploadSuccess) {
            onUploadSuccess(fileIds);
          }
        }
      },
      onError: (error) => {
        toast.error('Tải lên thất bại');
        console.error(error);
      },
    });
  };

  const isPending = isUploading || isAdding;

  return (
    <div className="relative">
      <Dropzone
        accept={{ 'image/*': [] }}
        maxFiles={10}
        maxSize={1024 * 1024 * 10}
        minSize={1024}
        onDrop={handleDrop}
        onError={console.error}
        src={files}
      >
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
      {isPending && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
          <span className="font-medium text-blue-600">Đang tải lên...</span>
        </div>
      )}
    </div>
  );
};
export default DropzoneComponent;