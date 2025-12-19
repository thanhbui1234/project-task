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
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { type IProject } from '@/types/project';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { isDirector } from '@/utils/role';
import { Link } from 'react-router-dom';

const statusConfig: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  PENDING: { label: 'Đang chờ', variant: 'secondary' },
  IN_PROGRESS: { label: 'Đang thực hiện', variant: 'default' },
  COMPLETED: { label: 'Hoàn thành', variant: 'outline' },
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
          variant: 'secondary',
        };

        return (
          <Card
            key={project.id}
            className="group relative h-full rounded-2xl border border-gray-200/80 bg-white transition-all hover:-translate-y-1 hover:shadow-lg pt-0"
          >
            {/* STATUS BADGE – GÓC TRÁI */}
            <Badge
              variant={status.variant}
              className="absolute top-3 left-3 z-10 text-xs"
            >
              {status.label}
            </Badge>

            {/* ACTION MENU – GÓC PHẢI */}
            {isDirector() && (
              <div className="absolute top-3 right-3 z-10 opacity-0 transition group-hover:opacity-100">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit?.(project)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
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
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              <CardHeader className="pb-3 pt-4">
                <CardTitle className="line-clamp-1 text-lg">
                  {project.name || 'Chưa đặt tên'}
                </CardTitle>

                <CardDescription className="line-clamp-2">
                  {project.client
                    ? `Khách hàng: ${project.client}`
                    : 'Chưa có khách hàng'}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Task count */}
                <div className="text-xs text-gray-500">
                  {project.taskCount} công việc
                </div>

                {/* START / END DATE */}
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ngày bắt đầu:</span>
                    <span className="font-medium">
                      {formatDate(project.startAt)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Ngày kết thúc:</span>
                    <span className="font-medium">
                      {formatDate(project.endAt)}
                    </span>
                  </div>
                </div>

                {/* OWNER */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-bold text-white">
                    {project.owner.charAt(0).toUpperCase()}
                  </div>
                  <span className="truncate text-xs text-gray-600">
                    {project.owner.split('@')[0]}
                  </span>
                </div>
              </CardContent>
            </Link>
          </Card>
        );
      })}
    </div>
  );
};
