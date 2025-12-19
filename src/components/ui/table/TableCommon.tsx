import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import React from 'react';
import { Input } from '../input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '../button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../table';
import { useReactTable } from '@tanstack/react-table';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { flexRender } from '@tanstack/react-table';
import type { Meta } from '@/types/meta';

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  onAdd?: () => void;
  addButtonText?: string;
  searchPlaceholder?: string;
  searchColumn?: string;
  // Server-side pagination props
  meta?: Meta;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  // Custom meta for columns (e.g., employees list)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableMeta?: Record<string, any>;
  onRowClick?: (row: TData) => void;
  showFilter?: boolean;
}

export function DataTableDemo<TData>({
  columns,
  data,
  onAdd,
  addButtonText = 'Thêm mới',
  searchPlaceholder = 'Tìm kiếm...',
  searchColumn = 'name',
  meta,
  onPageChange,
  isLoading = false,
  tableMeta,
  onRowClick,
  showFilter = true,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true, // Enable server-side pagination
    pageCount: meta?.totalPage ?? -1,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: tableMeta,
  });

  // Server-side pagination handlers
  const handlePreviousPage = () => {
    if (meta && meta.hasPreviousPage && onPageChange) {
      onPageChange(meta.page - 1);
    }
  };

  const handleNextPage = () => {
    if (meta && meta.hasNextPage && onPageChange) {
      onPageChange(meta.page + 1);
    }
  };

  const handleFirstPage = () => {
    if (onPageChange) {
      onPageChange(1);
    }
  };

  const handleLastPage = () => {
    if (meta && onPageChange) {
      onPageChange(meta.totalPage);
    }
  };

  return (
    <div className="w-full">
      {showFilter && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 py-4">
            <Input
              placeholder={searchPlaceholder}
              value={
                (table.getColumn(searchColumn)?.getFilterValue() as string) ??
                ''
              }
              onChange={(event) =>
                table
                  .getColumn(searchColumn)
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Cột <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-50">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {onAdd && (
            <Button variant="outline" size="sm" onClick={() => onAdd()}>
              {addButtonText}
            </Button>
          )}
        </div>
      )}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={
                    onRowClick
                      ? 'hover:bg-muted/50 cursor-pointer hover:cursor-pointer'
                      : ''
                  }
                  onClick={(e) => {
                    if (!onRowClick) return;

                    const target = e.target as HTMLElement;
                    if (target.closest('[data-no-row-click]')) return;

                    onRowClick(row.original);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {meta ? (
            <>
              Hiển thị {data.length} / {meta.total} bản ghi
            </>
          ) : (
            <>
              {table.getFilteredSelectedRowModel().rows.length} /{' '}
              {table.getFilteredRowModel().rows.length} hàng được chọn.
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {meta && (
            <span className="text-muted-foreground text-sm">
              Trang {meta.page} / {meta.totalPage}
            </span>
          )}
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleFirstPage}
              disabled={!meta?.hasPreviousPage}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handlePreviousPage}
              disabled={!meta?.hasPreviousPage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleNextPage}
              disabled={!meta?.hasNextPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleLastPage}
              disabled={!meta?.hasNextPage}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
