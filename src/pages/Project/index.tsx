import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/ui/DialogCustom";
import { Plus, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectSchema, type ICreateProjectSchema } from "@/schemas/Project";
import { ProjectFormContent } from "@/components/pages/Project/FormCreatProject";
import { useCreatProject } from "@/hooks/project/useCreatProject";
import { useGetProjects } from "@/hooks/project/useGetProject";
import { useDeleteProject } from "@/hooks/project/useDeleteProject";
import { useUpdateProject } from "@/hooks/project/useUpdateProject";
import { ProjectGrid } from "@/components/pages/Project/CardProject";
import type { registerType } from "@/schemas/auth";
import type { IProject } from "@/types/project";

export default function Projects() {
  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const { createProject, isPending } = useCreatProject();
  const { updateProject, isPending: isUpdatePending } = useUpdateProject();
  const { deleteProject, isPending: isDeletePending } = useDeleteProject();
  const handleDelete = () => {
    if (!selectedProject) return;
    deleteProject(selectedProject);
    setOpenDelete(false);
    setSelectedProject(null);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: isProjectPending
  } = useGetProjects({ name: debouncedTerm });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isProjectPending) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, isProjectPending]);

  const projects = data?.pages.flatMap((page) => page.docs) ?? [];

  const form = useForm({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      client: "",
      status: ""
    },
  });

  const handleEdit = (project: IProject) => {
    setSelectedProject(project);
    setMode('edit');
    form.reset({
      name: project.name,
      client: project.client,
      status: project.status,
    });
    setOpenModal(true);
  };

  const handleAdd = () => {
    setSelectedProject(null);
    setMode('create');
    form.reset({
      name: "",
      client: "",
      status: "",
    });
    setOpenModal(true);
  };

  const onSubmit = (data: ICreateProjectSchema) => {
    if (mode === 'create') {
      createProject(data as unknown as registerType);
    } else if (mode === 'edit' && selectedProject) {
      updateProject({ id: selectedProject.id, data });
    }
    setOpenModal(false);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
      <div className="fixed bottom-8 right-8 z-10">
        <Button
          size="lg"
          className="rounded-full shadow-2xl hover:scale-110 transition-transform"
          onClick={handleAdd}
        >
          <Plus className="mr-2 h-6 w-6" /> Thêm dự án
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="sticky top-0 z-20 mb-6 flex justify-end py-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              className="pl-9 bg-white/50 border-gray-200 focus:bg-white transition-all shadow-sm rounded-full"
              placeholder="Tìm kiếm dự án..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <ProjectGrid
          projects={projects}
          isFetching={isProjectPending}
          setOpenDelete={setOpenDelete}
          setSelectedProject={setSelectedProject}
          onEdit={handleEdit}
        />

        {/* Infinite scroll trigger */}
        <div ref={loadMoreRef} className="h-4 w-full flex justify-center p-4">
          {isFetchingNextPage && 'loadding.....'}
        </div>
      </div>

      <FormProvider {...form}>
        <CustomModal
          open={openModal}
          onOpenChange={setOpenModal}
          title={mode === 'create' ? "Thêm dự án mới" : "Cập nhật dự án"}
          description={mode === 'create' ? "Nhập thông tin dự án." : "Cập nhật thông tin dự án."}
          confirmText={mode === 'create' ? "Tạo dự án" : "Lưu thay đổi"}
          onConfirm={form.handleSubmit(onSubmit)}
          isLoading={mode === 'create' ? isPending : isUpdatePending}
        >
          <ProjectFormContent />
        </CustomModal>
      </FormProvider>
      <CustomModal
        open={openDelete}
        onOpenChange={setOpenDelete}
        title="Xóa dự án"
        description={`Bạn có chắc chắn muốn xóa dự án ${selectedProject?.name}?`}
        confirmText="Xóa"
        onConfirm={handleDelete}
        isLoading={isDeletePending}
      >
        <p>Khi xoá dự án sẽ không thể khôi phục lại</p>
      </CustomModal>

    </div>
  );
}