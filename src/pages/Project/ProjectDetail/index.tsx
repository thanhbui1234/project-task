'use client';

import { FormCreatTask } from '@/components/pages/Project/ProjectDetail/FormCreatTask';
import { Badge } from '@/components/ui/badge';
import { CustomModal } from '@/components/ui/DialogCustom';
import {
  taskColumns,
  type TaskTableMeta,
} from '@/components/ui/table/taskColumns';
import { DataTableDemo } from '@/components/ui/table/TableCommon';
import { STATUS_TASK, PRIORITY_TASK } from '@/consts/task';
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
  AlertTriangle,
  History,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { TAKE_PAGE } from '@/consts/query';
import { useGetProjectDetail } from '@/hooks/project/useGetProjectDetail';
import ListMolbie from '@/components/ui/ListMolbie';
import { useIsMobile } from '@/hooks/use-mobile';
import { getExpireStatus } from '@/utils/expriceDate';
import { EXPIRE_STATUS } from '@/consts/exprie';

const statusConfig: Record<
  string,
  {
    label: string;
    variant: 'default' | 'secondary' | 'outline';
    className: string;
  }
> = {
  CREATED: {
    label: 'Vừa tạo',
    variant: 'secondary',
    className: 'bg-slate-100 text-slate-700',
  },
  PENDING: {
    label: 'Đang chờ',
    variant: 'secondary',
    className: 'bg-amber-100 text-amber-700',
  },
  IN_PROGRESS: {
    label: 'Đang thực hiện',
    variant: 'default',
    className: 'bg-blue-100 text-blue-700',
  },
  COMPLETED: {
    label: 'Hoàn thành',
    variant: 'outline',
    className: 'bg-emerald-100 text-emerald-700',
  },
};

const expireUIConfig = {
  [EXPIRE_STATUS.ABOUT_TO_EXPIRE]: {
    label: 'Sắp hết hạn',
    badgeClass: 'bg-orange-500 text-white shadow-md shadow-orange-500/20 animate-pulse border-none',
    cardClass: 'border-orange-200 bg-orange-50/30',
    icon: <Clock className="mr-1.5 h-3.5 w-3.5" />,
    textColor: 'text-orange-700',
  },
  [EXPIRE_STATUS.EXPIRED]: {
    label: 'Đã hết hạn',
    badgeClass: 'bg-red-600 text-white shadow-md shadow-red-600/20 border-none',
    cardClass: 'border-red-200 bg-red-50/30',
    icon: <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />,
    textColor: 'text-red-700',
  },
  [EXPIRE_STATUS.ACTIVE]: null
};

const formatDate = (timestamp: number | null | undefined) => {
  if (!timestamp) return 'Chưa xác định';
  return format(new Date(timestamp), 'dd MMM, yyyy', { locale: vi });
};

export const ProjectDetail = () => {
  const { id: projectId } = useParams();
  const isMobile = useIsMobile();
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
      priority: PRIORITY_TASK.LOW,
      assignedTo: '',
      startAt: undefined,
      endAt: undefined,
    },
  });

  const expireStatus = projectDetail?.endAt ? getExpireStatus(projectDetail.endAt) : EXPIRE_STATUS.ACTIVE;
  const expireUI = expireUIConfig[expireStatus as keyof typeof expireUIConfig];

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
    // Đối với Create, chúng ta nên dùng toàn bộ data đã được Zod validate thành công.
    // Việc lọc dirtyFields chỉ thực sự cần thiết khi Update.
    const submitData = {
      ...data,
      // Đảm bảo các trường ngày tháng được định dạng đúng nếu cần (tùy thuộc vào yêu cầu của API)
      startAt: data.startAt ? new Date(data.startAt).getTime() : undefined,
      endAt: data.endAt ? new Date(data.endAt).getTime() : undefined,
    };

    console.log('Payload gửi đi:', submitData);

    createTask(submitData as ICreateTaskSchema);
    setOpenModal(false);
    form.reset({
      name: '',
      description: '',
      status: STATUS_TASK.STARTED,
      priority: PRIORITY_TASK.LOW,
      assignedTo: '',
      startAt: undefined,
      endAt: undefined,
    });
  };

  return (
    <>
      <div className="container mx-auto p-6">
        {/* Project Header */}
        <div className="mb-8 space-y-6">
          {/* Main Info Card */}
          <div className={`rounded-3xl border p-8 transition-all duration-300 shadow-sm overflow-hidden relative group ${expireUI ? expireUI.cardClass : 'border-gray-200/80 bg-gradient-to-br from-white to-gray-50/50'
            }`}>
            {/* Trang trí background */}
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-50/50 blur-3xl group-hover:bg-indigo-100/50 transition-colors duration-500" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              {/* Left - Project Info */}
              <div className="flex-1 space-y-6">
                <div className="flex flex-wrap items-start gap-5">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-xl transition-transform duration-300 group-hover:scale-110 ${expireStatus === EXPIRE_STATUS.EXPIRED ? 'bg-red-600 shadow-red-200' :
                    expireStatus === EXPIRE_STATUS.ABOUT_TO_EXPIRE ? 'bg-orange-500 shadow-orange-200' :
                      'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-200'
                    }`}>
                    <FolderKanban className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 lg:text-4xl">
                        {projectDetail?.name || 'Đang tải...'}
                      </h1>
                      {expireUI && (
                        <Badge className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${expireUI.badgeClass}`}>
                          {expireUI.icon}
                          {expireUI.label}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        className={`${statusConfig[projectDetail?.status ?? '']?.className ?? 'bg-gray-100 text-gray-700'} border-0 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide shadow-sm`}
                      >
                        {statusConfig[projectDetail?.status ?? '']?.label ??
                          projectDetail?.status}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                        <History className="h-3.5 w-3.5" />
                        ID: {projectId?.toString().slice(-8).toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Meta Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100">
                      <User2 className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Khách hàng</p>
                      <p className="text-sm font-semibold text-gray-700">{projectDetail?.client || 'Chưa xác định'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100">
                      <Calendar className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Thời hạn dự án</p>
                      <p className={`text-sm font-semibold ${expireUI ? expireUI.textColor : 'text-gray-700'}`}>
                        {formatDate(projectDetail?.startAt)} - {formatDate(projectDetail?.endAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100">
                      <Users className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Phụ trách</p>
                      {/* <p className="text-sm font-semibold text-gray-700">{projectDetail?.owner || 'Quản trị viên'}</p> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-blue-50/50 transition-transform group-hover:scale-150" />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 shadow-inner">
                  <PlayCircle className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-3xl font-black text-gray-900">
                  {projectDetail?.startedCount ?? 0}
                </p>
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mt-1">Sẵn sàng</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-purple-50/50 transition-transform group-hover:scale-150" />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 shadow-inner">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-3xl font-black text-gray-900">
                  {projectDetail?.acceptedCount ?? 0}
                </p>
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mt-1">Tiếp nhận</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className={`absolute -top-6 -right-6 h-20 w-20 rounded-full transition-transform group-hover:scale-150 ${expireUI ? 'bg-orange-50/50' : 'bg-amber-50/50'}`} />
              <div className="relative">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl shadow-inner ${expireUI ? 'bg-orange-100' : 'bg-amber-100'}`}>
                  <Clock className={`h-6 w-6 ${expireUI ? 'text-orange-600' : 'text-amber-600'}`} />
                </div>
                <p className="text-3xl font-black text-gray-900">
                  {projectDetail?.inProgressCount ?? 0}
                </p>
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mt-1">Đang làm</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-emerald-50/50 transition-transform group-hover:scale-150" />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 shadow-inner">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="text-3xl font-black text-gray-900">
                  {projectDetail?.completedCount ?? 0}
                </p>
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mt-1">Hoàn thành</p>
              </div>
            </div>
          </div>
        </div>
        {!isMobile && (
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
        )}
      </div>
      {isMobile && <ListMolbie data={tasksData?.docs ?? []} />}

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
