import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetDetailTask } from '@/hooks/task/useGetDetailTask';
import { useUpdateTask } from '@/hooks/task/useUpdateTask';
import { useDeleteTask } from '@/hooks/task/useDeleteTask';
import { useGetEmployee } from '@/hooks/employee/useGetEmployee';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { InputField } from '@/components/ui/InputField';
import { InputDatepicker } from '@/components/ui/InputDatepicker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { updateTaskSchema, type IUpdateTaskSchema } from '@/schemas/Project';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Clock,
  Edit3,
  ExternalLink,
  Flag,
  Link2,
  Loader2,
  MoreHorizontal,
  Trash2,
  User,
} from 'lucide-react';

import {
  PRIORITY_CONFIG_TASK,
  STATUS_TASK,
  PRIORITY_TASK,
} from '@/consts/task';
import { STATUS_CONFIG_TASK } from '@/consts/task';
import { toast } from 'sonner';

// Status config with colors and icons

const getStatusConfig = (status?: string) => {
  if (!status || !STATUS_CONFIG_TASK[status]) {
    return {
      label: status ?? '-',
      color: 'bg-gray-400',
      bgLight: 'bg-gray-100 dark:bg-gray-800',
      textColor: 'text-gray-600 dark:text-gray-400',
      icon: CircleDot,
    };
  }
  return STATUS_CONFIG_TASK[status];
};

const getInitials = (name: string | null) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Animation variants

export const TaskDetail = () => {
  const { id: taskId, projectId } = useParams();
  const navigate = useNavigate();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: task, isLoading } = useGetDetailTask({
    taskId: taskId as string,
  });
  const { data: employeesData } = useGetEmployee();
  const { updateTask, isPending: isUpdating } = useUpdateTask(
    projectId as string
  );
  const { deleteTask, isPending: isDeleting } = useDeleteTask(
    projectId as string
  );

  const employees = employeesData?.docs ?? [];

  // Form setup
  const methods = useForm<IUpdateTaskSchema>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      taskId: '',
      name: '',
      description: '',
      status: STATUS_TASK.STARTED,
      assignedTo: '',
      startAt: undefined,
      endAt: undefined,
      priority: PRIORITY_TASK.LOW,
    },
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = methods;

  // Typed control for InputField
  const typedControl = control;

  // Reset form when task data changes
  useEffect(() => {
    if (task) {
      reset({
        taskId: task.id,
        name: task.name,
        description: task.description || '',
        status: task.status,
        assignedTo: task.assignedTo || '',
        startAt: task.startAt ? new Date(task.startAt).getTime() : undefined,
        endAt: task.endAt ? new Date(task.endAt).getTime() : undefined,
        priority: task.priority || PRIORITY_TASK.LOW,
      });
    }
  }, [task, reset]);

  const onSubmit = (data: IUpdateTaskSchema) => {
    updateTask(data, {
      onSuccess: () => {
        setIsEditModalOpen(false);
      },
    });
  };

  const handleDelete = () => {
    if (taskId) {
      deleteTask(
        { id: taskId },
        {
          onSuccess: () => {
            setIsDeleteModalOpen(false);
            navigate(-1);
          },
        }
      );
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (task) {
      updateTask({
        taskId: task.id,
        name: task.name,
        description: task.description || '',
        status: newStatus,
        assignedTo: task.assignedTo || undefined,
        startAt: task.startAt ? new Date(task.startAt).getTime() : undefined,
        endAt: task.endAt ? new Date(task.endAt).getTime() : undefined,
      });
    }
  };
  const handleOpenInNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  const handleMarkComplete = () => {
    handleStatusChange(STATUS_TASK.COMPLETED);
  };
  const location = useLocation();

  const handleCopyLink = async () => {
    const url = `${window.location.origin}${location.pathname}${location.search}`;
    await navigator.clipboard.writeText(url);
    toast.success('Đã copy liên kết');
  };

  const statusConfig = getStatusConfig(task?.status);
  const StatusIcon = statusConfig.icon;

  // Find employee name by ID
  const getEmployeeName = (id: string | null) => {
    if (!id) return null;
    const employee = employees.find((e) => e.id === id);
    return employee?.name ?? employee?.email ?? id;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800/50">
        <div className="mx-auto max-w-7xl p-6">
          {/* Header Skeleton */}
          <div className="mb-8 flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-8 w-96" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content Skeleton */}
            <div className="space-y-6 lg:col-span-2">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-80 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!task) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800/50">
      <motion.div
        className="mx-auto max-w-7xl p-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Top Navigation Bar */}
        <motion.div
          variants={itemVariants}
          className="mb-6 flex flex-wrap items-center justify-between gap-4"
        >
          {/* Breadcrumb & Back */}
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="rounded-xl transition-all hover:scale-105 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Quay lại</TooltipContent>
            </Tooltip>

            <nav className="flex items-center gap-2 text-sm">
              <span className="cursor-pointer font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400">
                <Link to={`/project`}>{'Dự án của tôi'}</Link>
              </span>
              <span className="text-muted-foreground">/</span>
              <span className="cursor-pointer font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400">
                <Link to={`/project/${task.projectId}`}>{'Dự án'}</Link>
              </span>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-semibold">{task.name}</span>
            </nav>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleCopyLink()}
                  className="rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <Link2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sao chép liên kết</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
                  onClick={() => handleOpenInNewTab()}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Mở trong tab mới</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit3 className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Link2 className="mr-2 h-4 w-4" />
                  Liên kết task khác
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  variant="destructive"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              {/* Task Type Badge */}
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">
                    Độ ưu tiên:{' '}
                    <Badge
                      className={`${PRIORITY_CONFIG_TASK[task?.priority as keyof typeof PRIORITY_CONFIG_TASK]?.bgLight} ${PRIORITY_CONFIG_TASK[task?.priority as keyof typeof PRIORITY_CONFIG_TASK]?.textColor} border-0 font-medium`}
                    >
                      {
                        PRIORITY_CONFIG_TASK[
                          task?.priority as keyof typeof PRIORITY_CONFIG_TASK
                        ]?.label
                      }
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Title with inline edit button */}
              <div className="group flex items-center gap-3">
                <h1 className="text-foreground text-2xl font-bold tracking-tight md:text-3xl">
                  {task.name}
                </h1>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setIsEditModalOpen(true)}
                      className="rounded-lg opacity-0 transition-opacity group-hover:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Chỉnh sửa tiêu đề</TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Status Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${statusConfig.bgLight} ${statusConfig.textColor}`}
                >
                  <StatusIcon className="h-4 w-4" />
                  {statusConfig.label}
                  <ChevronDown className="h-4 w-4" />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {Object.entries(STATUS_CONFIG_TASK).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <DropdownMenuItem
                      key={key}
                      className="cursor-pointer"
                      onClick={() => handleStatusChange(key)}
                    >
                      <div
                        className={`mr-2 h-2 w-2 rounded-full ${config.color}`}
                      />
                      <Icon className="mr-2 h-4 w-4" />
                      {config.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        <Separator className="mb-8" />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* LEFT - Main Content */}
          <motion.div
            className="space-y-6 lg:col-span-2"
            variants={containerVariants}
          >
            {/* Description Card */}
            <motion.div variants={itemVariants}>
              <motion.div
                variants={cardHoverVariants}
                initial="rest"
                whileHover="hover"
              >
                <Card className="overflow-hidden border-0 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-purple-600">
                          <Edit3 className="h-4 w-4 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold">Mô tả</h2>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditModalOpen(true)}
                            className="rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/50"
                          >
                            <Edit3 className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Chỉnh sửa mô tả</TooltipContent>
                      </Tooltip>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={isDescriptionExpanded ? 'expanded' : 'collapsed'}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div
                          className={`prose prose-slate dark:prose-invert max-w-none ${
                            !isDescriptionExpanded &&
                            task.description &&
                            task.description.length > 300
                              ? 'line-clamp-4'
                              : ''
                          }`}
                        >
                          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {task.description || (
                              <span
                                className="cursor-pointer text-slate-400 italic hover:text-blue-500"
                                onClick={() => setIsEditModalOpen(true)}
                              >
                                Nhấn để thêm mô tả cho task này...
                              </span>
                            )}
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {task.description && task.description.length > 300 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setIsDescriptionExpanded(!isDescriptionExpanded)
                        }
                        className="mt-3 text-blue-600 hover:text-blue-700"
                      >
                        {isDescriptionExpanded ? 'Thu gọn' : 'Xem thêm'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Activity / Comments Section */}
            <motion.div variants={itemVariants}>
              <motion.div
                variants={cardHoverVariants}
                initial="rest"
                whileHover="hover"
              >
                <Card className="overflow-hidden border-0 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-cyan-500">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                      <h2 className="text-lg font-semibold">Báo cáo</h2>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-linear-to-br from-violet-500 to-purple-600 text-sm font-medium text-white">
                          {getInitials(getEmployeeName(task.assignedTo))}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-muted-foreground text-sm">
                          Thêm bình luận hoặc ghi chú...
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* RIGHT - Sidebar */}
          <motion.div className="space-y-4" variants={containerVariants}>
            {/* Details Card */}
            <motion.div variants={sidebarItemVariants}>
              <Card className="overflow-hidden border-0 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="border-b bg-linear-to-r from-slate-50 to-slate-100 px-5 py-4 dark:from-slate-800 dark:to-slate-800/50">
                    <h3 className="text-foreground font-semibold">Chi tiết</h3>
                  </div>

                  {/* Details List */}
                  <div className="divide-y">
                    {/* Assignee */}
                    <motion.div
                      className="group flex items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      whileHover={{ x: 2 }}
                    >
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <User className="h-4 w-4" />
                        <span>Người thực hiện</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-linear-to-br from-emerald-400 to-teal-500 text-xs font-medium text-white">
                            {getInitials(getEmployeeName(task.assignedTo))}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {getEmployeeName(task.assignedTo) ?? 'Chưa giao'}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setIsEditModalOpen(true)}
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </div>
                    </motion.div>

                    {/* Status */}
                    <motion.div
                      className="group flex items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      whileHover={{ x: 2 }}
                    >
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Flag className="h-4 w-4" />
                        <span>Trạng thái</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`${statusConfig.bgLight} ${statusConfig.textColor} border-0 font-medium`}
                        >
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusConfig.label}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setIsEditModalOpen(true)}
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </div>
                    </motion.div>

                    {/* Start Date */}
                    <motion.div
                      className="group flex items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      whileHover={{ x: 2 }}
                    >
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>Ngày bắt đầu</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {task.startAt
                            ? new Date(task.startAt).toLocaleDateString(
                                'vi-VN',
                                {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                }
                              )
                            : '-'}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setIsEditModalOpen(true)}
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </div>
                    </motion.div>

                    {/* End Date */}
                    <motion.div
                      className="group flex items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      whileHover={{ x: 2 }}
                    >
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>Ngày kết thúc</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {task.endAt
                            ? new Date(task.endAt).toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '-'}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setIsEditModalOpen(true)}
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </div>
                    </motion.div>

                    <Separator />

                    {/* Project */}
                    <motion.div
                      className="group flex items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      whileHover={{ x: 2 }}
                    >
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <div className="flex h-4 w-4 items-center justify-center rounded bg-blue-500">
                          <span className="text-[10px] font-bold text-white">
                            P
                          </span>
                        </div>
                        <span>Project</span>
                      </div>
                      <span className="cursor-pointer text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-400">
                        {task.name}
                      </span>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions Card */}
            <motion.div variants={sidebarItemVariants}>
              <Card className="overflow-hidden border-0 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
                <CardContent className="p-4">
                  <h3 className="text-muted-foreground mb-3 text-sm font-semibold">
                    Thao tác nhanh
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        onClick={() => setIsEditModalOpen(true)}
                        className="h-auto w-full flex-col gap-1 rounded-xl py-3 transition-all hover:border-blue-200 hover:bg-blue-50 dark:hover:border-blue-800 dark:hover:bg-blue-950/30"
                      >
                        <Edit3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs">Chỉnh sửa</span>
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        onClick={handleMarkComplete}
                        disabled={task.status === STATUS_TASK.COMPLETED}
                        className="h-auto w-full flex-col gap-1 rounded-xl py-3 transition-all hover:border-emerald-200 hover:bg-emerald-50 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30"
                      >
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs">Hoàn thành</span>
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                <Edit3 className="h-4 w-4 text-white" />
              </div>
              Chỉnh sửa Task
            </DialogTitle>
            <DialogDescription>
              Cập nhật thông tin task. Nhấn lưu khi hoàn tất.
            </DialogDescription>
          </DialogHeader>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <InputField<IUpdateTaskSchema>
                control={typedControl}
                name="name"
                label="Tên công việc"
                placeholder="Nhập tên công việc"
                errors={errors}
              />

              {/* Description */}
              <InputField<IUpdateTaskSchema>
                textarea
                control={typedControl}
                name="description"
                label="Mô tả"
                placeholder="Mô tả công việc"
                errors={errors}
              />

              {/* Status & Assignee */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(STATUS_CONFIG_TASK).map(
                            ([key, config]) => (
                              <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`h-2 w-2 rounded-full ${config.color}`}
                                  />
                                  {config.label}
                                </div>
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.status && (
                    <p className="text-destructive text-xs">
                      {errors.status.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Độ ưu tiên</Label>
                  <Controller
                    control={control}
                    name="priority"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn độ ưu tiên" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(PRIORITY_CONFIG_TASK).map(
                            ([key, config]) => (
                              <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`h-2 w-2 rounded-full ${config?.color}`}
                                  />
                                  {config.label}
                                </div>
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.priority && (
                    <p className="text-destructive text-xs">
                      {errors.priority.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Người được giao</Label>
                  <Controller
                    control={control}
                    name="assignedTo"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn người được giao" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-5 w-5">
                                  <AvatarFallback className="text-[10px]">
                                    {getInitials(employee.name)}
                                  </AvatarFallback>
                                </Avatar>
                                {employee.name ?? employee.email}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.assignedTo && (
                    <p className="text-destructive text-xs">
                      {errors.assignedTo.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
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
                      {errors.startAt.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
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
                      {errors.endAt.message}
                    </p>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    'Lưu thay đổi'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                <Trash2 className="h-4 w-4 text-red-600" />
              </div>
              Xóa Task
            </DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa task "{task?.name}"? Hành động này không
              thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                'Xóa task'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const sidebarItemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const cardHoverVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.01,
    transition: { duration: 0.2 },
  },
};
