import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@tanstack/react-table';
import type { ITask } from '@/types/task';
import type { IEmployee } from '@/types/employee';
import { PRIORITY_TASK, STATUS_CONFIG_TASK } from '@/consts/task';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown } from 'lucide-react';

// Type cho table meta
export interface TaskTableMeta {
  employees: IEmployee[];
}

// Hàm helper để lấy tên employee từ ID


export const taskColumns: ColumnDef<ITask>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Chọn tất cả"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Chọn hàng"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tên công việc
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('name')}</div>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Mô tả',
    cell: ({ row }) => (
      <div
        className="max-w-[200px] truncate"
        title={row.getValue('description')}
      >
        {row.getValue('description') || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const config = STATUS_CONFIG_TASK[status];

      if (!config) {
        return <Badge variant="secondary">{status}</Badge>;
      }

      const Icon = config.icon;

      return (
        <Badge
          className={`${config.bgLight} ${config.textColor} hover:${config.bgLight} border-0`}
        >
          {Icon && <Icon className="mr-1 h-3 w-3" />}
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'priority',
    header: 'Độ ưu tiên',
    cell: ({ row }) => {
      const priority = row.getValue('priority') as string;
      console.log(priority);
      switch (priority) {
        case PRIORITY_TASK.LOW:
          return 'Thấp';
        case PRIORITY_TASK.MEDIUM:
          return 'Trung bình';
        case PRIORITY_TASK.HIGH:
          return 'Cao';
        case PRIORITY_TASK.VERY_HIGH:
          return 'Rất cao';
        default:
          return priority;
      }
    },
  },
  {
    accessorKey: 'startAt',
    header: 'Ngày bắt đầu',
    cell: ({ row }) => {
      const date = row.getValue('startAt') as string | null;
      return (
        <div>{date ? new Date(date).toLocaleDateString('vi-VN') : '-'}</div>
      );
    },
  },
  {
    accessorKey: 'endAt',
    header: 'Ngày kết thúc',
    cell: ({ row }) => {
      const date = row.getValue('endAt') as string | null;
      return (
        <div>{date ? new Date(date).toLocaleDateString('vi-VN') : '-'}</div>
      );
    },
  }
];
