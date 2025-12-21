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

import { useEffect } from 'react';
import { useGetCustomer } from '@/hooks/employee/useGetCustomer';

export const ProjectFormContent = () => {
  const {
    control,
    setValue,
    formState: { errors, defaultValues },
    watch,
  } = useFormContext();
  const { data: customers } = useGetCustomer();
  const customerOptions = customers?.docs.map((customer) => ({
    value: customer.id,
    label: customer.name,
  })) || [];
  console.log(customerOptions, 'customerOptions')
  const status = watch('status');
  const isCompleted = status === STATUS_PROJECT.COMPLETED;

  useEffect(() => {
    if (isCompleted) {
      // Create a specific type for the project form values to safely access startAt/endAt
      // allowing for flexible typing since defaultValues comes as DeepPartial<T>
      const defaults = defaultValues as { startAt?: number; endAt?: number } | undefined;

      setValue('startAt', defaults?.startAt);
      setValue('endAt', defaults?.endAt);
    }
  }, [isCompleted, setValue, defaultValues]);

  return (
    <div className="grid gap-5 py-4">
      <InputField
        control={control}
        name="name"
        label="Tên dự án"
        placeholder="Nhập tên dự án"
        errors={errors}
      />

      <div className="grid gap-2">
        <Label>Khách hàng</Label>
        <Controller
          control={control}
          name="customers"
          render={({ field }) => (
            <Select
              onValueChange={(val) => field.onChange([val])}
              value={field.value?.[0] || ''}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn khách hàng" />
              </SelectTrigger>
              <SelectContent>
                {customerOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.customers && (
          <p className="text-xs text-red-500">
            {errors.customers.message as string}
          </p>
        )}
      </div>
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
                  disabled={isCompleted}
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
                  disabled={isCompleted}
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
