import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import type { ColumnDef } from "@tanstack/react-table"
import type { ITask } from "@/types/task"
import type { IEmployee } from "@/types/employee"
import { STATUS_TASK } from "@/consts/statusProject"
import { Badge } from "@/components/ui/badge"

const getStatusLabel = (status: string) => {
  switch (status) {
    case STATUS_TASK.STARTED:
      return "Bắt đầu"
    case STATUS_TASK.ACCEPTED:
      return "Đã nhận việc"
    case STATUS_TASK.IN_PROGRESS:
      return "Đang thực hiện"
    case STATUS_TASK.COMPLETED:
      return "Hoàn thành"
    default:
      return status
  }
}

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case STATUS_TASK.STARTED:
      return "outline"
    case STATUS_TASK.ACCEPTED:
      return "secondary"
    case STATUS_TASK.IN_PROGRESS:
      return "default"
    case STATUS_TASK.COMPLETED:
      return "secondary"
    default:
      return "outline"
  }
}

// Type cho table meta
export interface TaskTableMeta {
  employees: IEmployee[]
}

// Hàm helper để lấy tên employee từ ID
const getEmployeeName = (employeeId: string | null, employees: IEmployee[]): string => {
  if (!employeeId) return "Chưa giao"
  const employee = employees.find((emp) => emp.id === employeeId)
  return employee?.name ?? employee?.email ?? "Không xác định"
}

export const taskColumns: ColumnDef<ITask>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên công việc
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate" title={row.getValue("description")}>
        {row.getValue("description") || "-"}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={getStatusVariant(status)}>
          {getStatusLabel(status)}
        </Badge>
      )
    },
  },
  {
    accessorKey: "assignedTo",
    header: "Người được giao",
    cell: ({ row, table }) => {
      const assignedTo = row.getValue("assignedTo") as string | null
      const employees = (table.options.meta as TaskTableMeta)?.employees ?? []
      return <div>{getEmployeeName(assignedTo, employees)}</div>
    },
  },
  {
    accessorKey: "startAt",
    header: "Ngày bắt đầu",
    cell: ({ row }) => {
      const date = row.getValue("startAt") as string | null
      return <div>{date ? new Date(date).toLocaleDateString("vi-VN") : "-"}</div>
    },
  },
  {
    accessorKey: "endAt",
    header: "Ngày kết thúc",
    cell: ({ row }) => {
      const date = row.getValue("endAt") as string | null
      return <div>{date ? new Date(date).toLocaleDateString("vi-VN") : "-"}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const task = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(task.id)}
            >
              Sao chép ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
