'use client';
import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import type { IEmployee } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import { useDeleteEmployee } from '@/hooks/employee/useDeleteEmployee';
import { CustomModal } from '@/components/ui/DialogCustom';

const EmployeeDeleteAction = ({ employee }: { employee: IEmployee }) => {
  const [open, setOpen] = useState(false);
  const { deleteEmployee, isPending } = useDeleteEmployee();

  const handleDelete = () => {
    deleteEmployee(
      { id: employee.id },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="text-red-500 hover:text-red-600 hover:bg-red-50"
      >
        <Trash className="h-4 w-4" />
      </Button>

      <CustomModal
        open={open}
        onOpenChange={setOpen}
        title="Xóa nhân viên"
        description={`Bạn có chắc chắn muốn xóa nhân viên "${employee.name}" không? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleDelete}
        isLoading={isPending}
      />
    </div>
  );
};

export const employeeColumns: ColumnDef<IEmployee>[] = [
  {
    accessorKey: 'name',
    header: 'Họ và tên',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-slate-900 dark:text-slate-100">
          {row.getValue('name') || 'N/A'}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-slate-500 dark:text-slate-400">
          {row.getValue('email')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Số điện thoại',
    cell: ({ row }) => (
      <div className="text-slate-500 dark:text-slate-400">
        {row.getValue('phoneNumber') || 'N/A'}
      </div>
    ),
  },
  {
    accessorKey: 'role',
    header: 'Vai trò',
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      return (
        <Badge
          variant="outline"
          className={
            role === 'ADMIN'
              ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400'
              : 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/30 dark:bg-blue-900/20 dark:text-blue-400'
          }
        >
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          variant="secondary"
          className={
            status === 'ACTIVE'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'action',
    header: 'Hành động',
    cell: ({ row }) => <EmployeeDeleteAction employee={row.original} />,
  },
];
