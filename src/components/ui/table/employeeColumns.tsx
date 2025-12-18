'use client';
import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import type { IEmployee } from '@/types/employee';

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
];
