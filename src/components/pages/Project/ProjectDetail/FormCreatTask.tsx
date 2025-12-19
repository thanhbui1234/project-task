// components/pages/Project/FormCreateTask.tsx
'use client';

import { motion } from 'framer-motion';
import { Controller, useFormContext } from 'react-hook-form';

import { InputField } from '@/components/ui/InputField';
import { InputDatepicker } from '@/components/ui/InputDatepicker';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { PRIORITY_TASK, STATUS_TASK } from '@/consts/task';
import type { IEmployee } from '@/types/employee';

export const FormCreatTask = ({
  mode,
  employees,
}: {
  mode: 'create' | 'update';
  employees: IEmployee[];
}) => {
  const isUpdate = mode === 'update';
  const {
    control,
    formState: { errors, dirtyFields },
  } = useFormContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="grid gap-6 py-4"
    >
      {/* ===== BASIC INFO ===== */}
      <div className="grid grid-cols-1 gap-5">
        <InputField
          control={control}
          name="name"
          label="Tên công việc"
          placeholder="Nhập tên công việc"
          errors={errors}
          className="w-full"
        />

        <div className="md:col-span-2">
          <InputField
            textarea={true}
            control={control}
            name="description"
            label="Mô tả"
            placeholder="Mô tả công việc"
            errors={errors}
            type="textarea"
          />
        </div>
      </div>

      {/* ===== STATUS & ASSIGNEE ===== */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="grid gap-2">
          <Label>Trạng thái</Label>
          <Controller
            disabled={!isUpdate}
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={!isUpdate}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={STATUS_TASK.STARTED}>Bắt đầu</SelectItem>
                  <SelectItem value={STATUS_TASK.IN_PROGRESS}>
                    Đang thực hiện
                  </SelectItem>
                  <SelectItem value={STATUS_TASK.ACCEPTED}>
                    Đã nhận việc
                  </SelectItem>
                  <SelectItem value={STATUS_TASK.COMPLETED}>
                    Hoàn thành
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && (
            <p className="text-destructive text-xs">
              {errors.status.message as string}
            </p>
          )}
        </div>
        <div className="grid grid-c gap-2 w-full ">
          <Label>Độ ưu tiên</Label>
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn độ ưu tiên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PRIORITY_TASK.LOW}>Thấp</SelectItem>
                  <SelectItem value={PRIORITY_TASK.MEDIUM}>
                    Trung bình
                  </SelectItem>
                  <SelectItem value={PRIORITY_TASK.HIGH}>Cao</SelectItem>
                  <SelectItem value={PRIORITY_TASK.VERY_HIGH}>
                    Rất cao
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.priority && (
            <p className="text-destructive text-xs">
              {errors.priority.message as string}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label>Người được giao</Label>
          <Controller
            control={control}
            name="assignedTo"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn người được giao" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name ?? employee.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.assignedTo && (
            <p className="text-destructive text-xs">
              {errors.assignedTo.message as string}
            </p>
          )}
        </div>
      </div>

      {/* ===== DATES ===== */}
      <div className="grid grid-cols-1 gap-5">
        <div className="grid gap-2">
          <Label>Ngày bắt đầu</Label>
          <Controller
            control={control}
            name="startAt"
            render={({ field }) => (
              <InputDatepicker value={field.value} onChange={field.onChange} />
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
              <InputDatepicker value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.endAt && (
            <p className="text-destructive text-xs">
              {errors.endAt.message as string}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
