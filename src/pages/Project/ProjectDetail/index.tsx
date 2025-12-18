'use client';

import { FormCreatTask } from '@/components/pages/Project/ProjectDetail/FormCreatTask';
import { Badge } from '@/components/ui/badge';
import { CustomModal } from '@/components/ui/DialogCustom';
import {
  taskColumns,
  type TaskTableMeta,
} from '@/components/ui/table/taskColumns';
import { DataTableDemo } from '@/components/ui/table/TableCommon';
import { STATUS_TASK } from '@/consts/task';
import { useGetEmployee } from '@/hooks/employee/useGetEmployee';
import { useCreatTask } from '@/hooks/task/useCreateTask';
import { useGetTasks } from '@/hooks/task/useGetTask';
import { createTaskSchema, type ICreateTaskSchema } from '@/schemas/Project';
import type { ITask } from '@/types/task';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Calendar,
  CheckCircle2,
  Clock,
  FolderKanban,
  PlayCircle,
  User2,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { TAKE_PAGE } from '@/consts/query';
import { useGetProjectDetail } from '@/hooks/project/useGetProjectDetail';

const statusConfig: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'outline'; className: string }
> = {
  CREATED: { label: 'Vừa tạo', variant: 'secondary', className: 'bg-slate-100 text-slate-700' },
  PENDING: { label: 'Đang chờ', variant: 'secondary', className: 'bg-amber-100 text-amber-700' },
  IN_PROGRESS: { label: 'Đang thực hiện', variant: 'default', className: 'bg-blue-100 text-blue-700' },
  COMPLETED: { label: 'Hoàn thành', variant: 'outline', className: 'bg-emerald-100 text-emerald-700' },
};

const formatDate = (timestamp: number | null | undefined) => {
  if (!timestamp) return 'Chưa xác định';
  return format(new Date(timestamp), 'dd MMM, yyyy', { locale: vi });
};

export const ProjectDetail = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: projectDetail } = useGetProjectDetail(projectId as string);
  const { createTask, isPending } = useCreatTask(projectId as string);
  const { data: employees } = useGetEmployee();
  const { data: tasksData, isLoading: isLoadingTasks } = useGetTasks({
    projectId: projectId as string,
    page: currentPage,
    take: TAKE_PAGE,
  });

  const form = useForm({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      name: '',
      description: '',
      status: STATUS_TASK.STARTED,
      startAt: undefined,
      endAt: undefined,
    },
  });

  // Memo tableMeta để tránh re-render không cần thiết
  const tableMeta = useMemo<TaskTableMeta>(
    () => ({
      employees: employees?.docs ?? [],
    }),
    [employees?.docs]
  );

  const handleAdd = () => {
    setOpenModal(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onSubmit = (data: ICreateTaskSchema) => {
    console.log(data);
    createTask(data as unknown as ICreateTaskSchema);
    setOpenModal(false);
    form.reset();
  };

  return (
    <>
      <div className="container mx-auto p-6">
        {/* Project Header */}
        <div className="mb-6 space-y-4">
          {/* Main Info Card */}
          <div className="rounded-2xl border border-gray-200/80 bg-gradient-to-br from-white to-gray-50/50 p-6 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              {/* Left - Project Info */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200">
                    <FolderKanban className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {projectDetail?.name || 'Đang tải...'}
                    </h1>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        className={`${statusConfig[projectDetail?.status ?? '']?.className ?? 'bg-gray-100 text-gray-700'} border-0 px-3 py-1 text-xs font-medium`}
                      >
                        {statusConfig[projectDetail?.status ?? '']?.label ?? projectDetail?.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User2 className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Khách hàng:</span>
                    <span>{projectDetail?.client || 'Chưa có'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Thời gian:</span>
                    <span>
                      {formatDate(projectDetail?.startAt)} - {formatDate(projectDetail?.endAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Tổng công việc:</span>
                    <span className="font-semibold text-indigo-600">
                      {projectDetail?.taskCount ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="group relative overflow-hidden rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm transition-all hover:shadow-md">
              <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-blue-50 transition-transform group-hover:scale-125" />
              <div className="relative">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <PlayCircle className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {projectDetail?.startedCount ?? 0}
                </p>
                <p className="text-xs font-medium text-gray-500">Bắt đầu</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm transition-all hover:shadow-md">
              <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-purple-50 transition-transform group-hover:scale-125" />
              <div className="relative">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {projectDetail?.acceptedCount ?? 0}
                </p>
                <p className="text-xs font-medium text-gray-500">Đã nhận</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm transition-all hover:shadow-md">
              <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-amber-50 transition-transform group-hover:scale-125" />
              <div className="relative">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {projectDetail?.inProgressCount ?? 0}
                </p>
                <p className="text-xs font-medium text-gray-500">Đang làm</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm transition-all hover:shadow-md">
              <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-emerald-50 transition-transform group-hover:scale-125" />
              <div className="relative">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {projectDetail?.completedCount ?? 0}
                </p>
                <p className="text-xs font-medium text-gray-500">Hoàn thành</p>
              </div>
            </div>
          </div>
        </div>

        {/* Task Table */}
        <DataTableDemo
          columns={taskColumns}
          data={tasksData?.docs ?? []}
          onAdd={handleAdd}
          addButtonText="Thêm công việc"
          searchPlaceholder="Tìm kiếm công việc..."
          searchColumn="name"
          meta={tasksData?.meta}
          onPageChange={handlePageChange}
          isLoading={isLoadingTasks}
          tableMeta={tableMeta}
          onRowClick={(task: ITask) => navigate(`/task/${task.id}`)}
        />
      </div>

      <FormProvider {...form}>
        <CustomModal
          open={openModal}
          onOpenChange={setOpenModal}
          title="Thêm công việc"
          description="Nhập thông tin công việc."
          confirmText="Thêm"
          onConfirm={form.handleSubmit(onSubmit)}
          isLoading={isPending}
        >
          <FormCreatTask mode="create" employees={employees?.docs ?? []} />
        </CustomModal>
      </FormProvider>
    </>
  );
};
