// components/project/ProjectGrid.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { MoreVertical, Edit, Trash2, Clock, AlertTriangle } from 'lucide-react';
import { type IProject } from '@/types/project';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { isDirector } from '@/utils/role';
import { Link } from 'react-router-dom';
import { getExpireStatus } from '@/utils/expriceDate';
import { EXPIRE_STATUS } from '@/consts/exprie';
import { STATUS_PROJECT } from '@/consts/statusProject';

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  [STATUS_PROJECT.PENDING]: {
    label: 'Đang chờ',
    className: 'bg-amber-100 text-amber-700 hover:bg-amber-200/80'
  },
  [STATUS_PROJECT.IN_PROGRESS]: {
    label: 'Đang thực hiện',
    className: 'bg-blue-100 text-blue-700 hover:bg-blue-200/80'
  },
  [STATUS_PROJECT.COMPLETED]: {
    label: 'Hoàn thành',
    className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200/80'
  },
};

const expireUIConfig = {
  [EXPIRE_STATUS.ABOUT_TO_EXPIRE]: {
    label: 'Sắp hết hạn',
    badgeClass: 'bg-orange-500 text-white border-none shadow-lg shadow-orange-500/30 animate-pulse',
    cardClass: 'border-orange-500/50 ring-1 ring-orange-500/20 shadow-orange-50',
    icon: <Clock className="mr-1 h-3 w-3" />,
  },
  [EXPIRE_STATUS.EXPIRED]: {
    label: 'Đã hết hạn',
    badgeClass: 'bg-red-600 text-white border-none shadow-lg shadow-red-600/30',
    cardClass: 'border-red-600 ring-2 ring-red-600/10 shadow-red-50',
    icon: <AlertTriangle className="mr-1 h-3 w-3" />,
  },
  [EXPIRE_STATUS.ACTIVE]: null
};

const images = [
  '/banner1.jpg',
  '/banner2.jpg',
  '/banner3.jpg',
  '/banner4.jpg',
  '/banner5.jpg',
  '/banner6.jpg',
  '/banner7.jpg',
  '/banner8.jpg',
  '/banner9.jpg',
  '/banner10.jpg',
];

export const ProjectGrid = ({
  projects,
  isFetching,
  onEdit,
  setOpenDelete,
  setSelectedProject,
}: {
  projects: IProject[];
  isFetching: boolean;
  onEdit?: (project: IProject) => void;
  setOpenDelete: (open: boolean) => void;
  setSelectedProject: (project: IProject | null) => void;
}) => {
  if (isFetching) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-72 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!projects?.length) {
    return (
      <div className="py-20 text-center text-lg text-gray-500">
        Chưa có dự án nào
      </div>
    );
  }
  const formatDate = (timestamp?: number | null) => {
    if (!timestamp) return 'Chưa xác định';
    return new Date(timestamp).toLocaleDateString('vi-VN');
  };

  const getImage = (id: string | number) => {
    const strId = id.toString();
    let hash = 0;
    for (let i = 0; i < strId.length; i++) {
      hash = strId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return images[Math.abs(hash) % images.length];
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {projects.map((project) => {
        const status = statusConfig[project.status] ?? {
          label: 'Không xác định',
          className: 'bg-gray-100 text-gray-700',
        };

        const isCompleted = project.status === STATUS_PROJECT.COMPLETED;
        const expireStatus = (project.endAt && !isCompleted) ? getExpireStatus(project.endAt) : EXPIRE_STATUS.ACTIVE;
        const expireUI = expireUIConfig[expireStatus as keyof typeof expireUIConfig];

        return (
          <Card
            key={project.id}
            className={`group relative h-full rounded-2xl border bg-white transition-all hover:-translate-y-1 hover:shadow-xl pt-0 ${expireUI ? expireUI.cardClass : 'border-gray-200/80 shadow-sm'
              }`}
          >
            {/* STATUS BADGE – GÓC TRÁI */}
            <Badge
              className={`absolute top-3 left-3 z-10 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md ${status.className}`}
            >
              {status.label}
            </Badge>

            {/* EXPIRE BADGE – GÓC PHẢI (Nếu có) */}
            {expireUI && (
              <Badge
                className={`absolute top-3 right-3 z-10 flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight ${expireUI.badgeClass}`}
              >
                {expireUI.icon}
                {expireUI.label}
              </Badge>
            )}

            {/* ACTION MENU – GÓC PHẢI (Ẩn đi nếu có Badge hết hạn và không hover) */}
            {isDirector() && (
              <div className={`absolute top-3 right-3 z-20 transition-opacity duration-200 ${expireUI ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full bg-white/90 shadow-sm backdrop-blur-sm hover:bg-white"
                    >
                      <MoreVertical className="h-4 w-4 text-gray-600" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => onEdit?.(project)} className="cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 cursor-pointer"
                      onClick={() => {
                        setSelectedProject(project);
                        setOpenDelete(true);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa dự án
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            <Link to={`/project/${project.id}`}>
              <div className="relative h-40 w-full overflow-hidden rounded-t-2xl">
                <img
                  src={getImage(project.id)}
                  alt={project.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              </div>

              <CardHeader className="pb-2 pt-4">
                <CardTitle className="line-clamp-1 text-lg font-bold text-gray-800">
                  {project.name || 'Chưa đặt tên'}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Task count & Progress placeholder */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {project.taskCount} công việc
                  </span>
                </div>

                {/* START / END DATE */}
                <div className="space-y-2 rounded-xl bg-gray-50 p-2.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-400 font-medium">Bắt đầu:</span>
                    <span className="font-semibold text-gray-700">
                      {formatDate(project.startAt)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-400 font-medium">Kết thúc:</span>
                    <span className={`font-bold ${expireStatus === EXPIRE_STATUS.EXPIRED ? 'text-red-600' : 'text-gray-700'}`}>
                      {formatDate(project.endAt)}
                    </span>
                  </div>
                </div>

                {/* OWNER */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    {project?.owner?.avatar?.path ? (
                      <img
                        src={project.owner.avatar.path}
                        alt={project.owner.name || ''}
                        className="h-6 w-6 rounded-full object-cover border border-gray-100 shadow-sm"
                      />
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[10px] font-bold text-white shadow-sm">
                        {(project?.owner?.name || project?.owner?.email || 'A').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="truncate text-[11px] font-medium text-gray-600">
                      {project?.owner?.name || project?.owner?.email?.split('@')[0] || 'Unknown'}
                    </span>
                  </div>
                  <div className="text-[10px] font-medium text-gray-400">
                    ID: {project.id.toString().slice(0, 5)}...
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        );
      })}
    </div>
  );
};

