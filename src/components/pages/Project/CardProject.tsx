// components/project/ProjectGrid.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { MoreVertical, Edit, Trash2 } from "lucide-react"
import { type IProject } from "@/types/project"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { isDirector } from "@/utils/role"
const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  CREATED: { label: "Vừa tạo", variant: "secondary" },
  PENDING: { label: "Đang chờ", variant: "secondary" },
  IN_PROGRESS: { label: "Đang thực hiện", variant: "default" },
  COMPLETED: { label: "Hoàn thành", variant: "outline" },
}

const ProjectSkeleton = () => (
  <Card className="h-full border border-gray-200/80 rounded-2xl bg-white">
    <CardHeader className="pb-3">
      <Skeleton className="h-40 w-full rounded-xl bg-gray-200/70" />
      <Skeleton className="h-6 w-4/5 mt-4 rounded-lg" />
      <Skeleton className="h-4 w-full mt-2 rounded" />
    </CardHeader>
    <CardContent className="pt-2">
      <div className="flex justify-between items-center mb-3">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-4 w-16 rounded" />
      </div>
    </CardContent>
  </Card>
)

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
  onDelete?: (project: IProject) => void;
  setOpenDelete: (open: boolean) => void;
  setSelectedProject: (project: IProject | null) => void;
}) => {
  if (isFetching) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <ProjectSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    )
  }

  if (!projects || projects.length === 0) {
    return <div className="text-center py-20 text-gray-500 text-lg">Chưa có dự án nào</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {projects.map((project) => {
        const status = statusConfig[project.status] || { label: "Không xác định", variant: "secondary" }

        return (
          <Card
            key={project.id}
            className="group relative h-full border border-gray-200/80 rounded-2xl bg-white/80 backdrop-blur-sm
                       hover:shadow-xl hover:border-gray-300 hover:-translate-y-1.5
                       transition-all duration-300 overflow-hidden"
          >
            {/* Nút 3 chấm chỉ hiện khi hover */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {isDirector() && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white/80 backdrop-blur hover:bg-gray-100"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => onEdit?.(project)} className="cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedProject(project);
                        setOpenDelete(true);
                      }}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa dự án
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <CardHeader className="pb-3">
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl w-full h-40 mb-4" />

              <CardTitle className="text-lg font-medium text-gray-900 line-clamp-1 pr-10">
                {project.name || "Chưa đặt tên"}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 line-clamp-2">
                {project.client ? `Khách hàng: ${project.client}` : "Chưa có khách hàng"}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant={status.variant} className="text-xs font-medium">
                  {status.label}
                </Badge>
                <span className="text-xs text-gray-500">
                  {project.taskCount} công việc
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {project.owner.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-gray-600 truncate">
                  {project.owner.split("@")[0]}
                </span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}