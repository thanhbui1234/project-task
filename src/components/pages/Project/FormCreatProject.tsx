// components/pages/Project/FormCreateProject.tsx
import { InputField } from '@/components/ui/InputField';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormContext, Controller } from 'react-hook-form';
import { STATUS_PROJECT } from '@/consts/statusProject';
import { InputDatepicker } from '@/components/ui/InputDatepicker';

export const ProjectFormContent = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

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
                <SelectItem value={STATUS_PROJECT.IN_PROGRESS}>
                  Đang thực hiện
                </SelectItem>
                <SelectItem value={STATUS_PROJECT.PENDING}>Đang chờ</SelectItem>
                <SelectItem value={STATUS_PROJECT.COMPLETED}>
                  Hoàn thành
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.status && (
          <p className="text-xs text-red-500">
            {errors.status.message as string}
          </p>
        )}

        {/* ===== DATES ===== */}
        <div className="mt-5 flex flex-col gap-4">
          <div className="grid gap-2">
            <Label>Ngày bắt đầu</Label>
            <Controller
              control={control}
              name="startAt"
              render={({ field }) => (
                <InputDatepicker
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.startAt && (
              <p className="text-destructive text-xs">
                {errors.startAt.message as string}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Ngày kết thúc</Label>
            <Controller
              control={control}
              name="endAt"
              render={({ field }) => (
                <InputDatepicker
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.endAt && (
              <p className="text-destructive text-xs">
                {errors.endAt.message as string}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
