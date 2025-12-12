// components/pages/Project/FormCreateProject.tsx
import { InputField } from "@/components/ui/InputField";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext, Controller } from "react-hook-form";
import { STATUS_PROJECT } from "@/consts/statusProject";
import type { IProject } from "@/types/project";
import { useEffect } from "react";

export const ProjectFormContent = ({ selectedProject }: { selectedProject: IProject }) => {
  const { control, formState: { errors }, setValue } = useFormContext();

  useEffect(() => {
    if (selectedProject) {
      setValue("name", selectedProject.name);
      setValue("client", selectedProject.client);
      setValue("status", selectedProject.status);
    }
  }, [selectedProject, setValue]);

  return (
    <div className="grid gap-5 py-4">
      <InputField
        control={control}
        name="name"
        label="Tên dự án"
        placeholder="Nhập tên dự án"
        errors={errors}
      />

      <InputField
        control={control}
        name="client"
        label="Khách hàng"
        placeholder="Tên khách hàng"
        errors={errors}
      />

      <div className="grid gap-2">
        <Label>Trạng thái</Label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={STATUS_PROJECT.CREATED}>Bắt đầu</SelectItem>
                <SelectItem value={STATUS_PROJECT.IN_PROGRESS}>Đang thực hiện</SelectItem>
                <SelectItem value={STATUS_PROJECT.PENDING}>Đang chờ</SelectItem>
                <SelectItem value={STATUS_PROJECT.COMPLETED}>Hoàn thành</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.status && (
          <p className="text-xs text-red-500">
            {errors.status.message as string}
          </p>
        )}
      </div>

    </div>
  );
};