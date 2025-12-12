  import { Button } from "@/components/ui/button";
  import { CustomModal } from "@/components/ui/DialogCustom";
  import { Plus } from "lucide-react";
  import { useState } from "react";
  import { useForm, FormProvider } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { createProjectSchema, type ICreateProjectSchema } from "@/schemas/Project";
  import { ProjectFormContent } from "@/components/pages/Project/FormCreatProject";
  import { useCreatProject } from "@/hooks/project/useCreatProject";
  import { useGetProjects } from "@/hooks/project/useGetProject";
  import { useDeleteProject } from "@/hooks/project/useDeleteProject";
  import { ProjectGrid } from "@/components/pages/Project/CardProject";
  import type { IProject } from "@/types/project";
  import type { registerType } from "@/schemas/auth";
import { useUpdateProject } from "@/hooks/project/useUpdateProject";

  export default function Projects() {
    const [openModal, setOpenModal] = useState(false);
    const [openConfimrmDelete , setOpenConfimrmDelete] = useState(false);
    const [mode,setMode] = useState<"create" | "update">("create");
    const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
    const { createProject, isPending } = useCreatProject();
    const { deleteProject, isPending: isPendingDelete } = useDeleteProject();
    const { updateProject, isPending: isPendingUpdate } = useUpdateProject();
    const { data, isFetching } = useGetProjects();
    const form = useForm({
      resolver: zodResolver(createProjectSchema),
      defaultValues: {
        name: "",
        client: "",
        status: ""
      },
    });

    const onSubmit = (data: ICreateProjectSchema) => {
      if (mode === "create") {
        createProject(data as unknown as registerType);
      } else {
        updateProject(data as unknown as registerType);
      }
      setOpenModal(false);
      form.reset();
    };

    const handleDelete = () => {
      if (selectedProject) {
        deleteProject({ id: selectedProject.id }, {
          onSuccess: () => {
            setOpenConfimrmDelete(false);
            setSelectedProject(null);
          }
        });
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
        <div className="fixed bottom-8 right-8 z-10">
          <Button
            size="lg"
            className="rounded-full shadow-2xl hover:scale-110 transition-transform"
            onClick={() => setOpenModal(true)}
          >
            <Plus className="mr-2 h-6 w-6" /> Thêm dự án
          </Button>
        </div>

        <ProjectGrid 
          projects={data?.docs as IProject[]} 
          isFetching={isFetching} 
          onDelete={(project) => {
            setSelectedProject(project);
            setOpenConfimrmDelete(true);
          }} 
          onEdit={(project) => {
            setSelectedProject(project);
            setMode("update");
            setOpenModal(true);
          }}
        />

        <FormProvider {...form}>
          <CustomModal
            open={openModal}
            onOpenChange={setOpenModal}
            title={mode === "create" ? "Thêm dự án mới" : `Chỉnh sửa dự án ${selectedProject?.name}`}
            description="Nhập thông tin dự án."
            confirmText={mode === "create" ? "Tạo dự án" : "Cập nhật dự án"}
            onConfirm={form.handleSubmit(onSubmit)}
            loading={mode === "create" ? isPending : isPendingUpdate}
          >
            <ProjectFormContent selectedProject={selectedProject as IProject} />
          </CustomModal>
        </FormProvider>

      <CustomModal 
        open={openConfimrmDelete} 
        onOpenChange={setOpenConfimrmDelete} 
        title="Xóa dự án"  
        confirmText="Xóa" 
        onConfirm={handleDelete} 
        loading={isPendingDelete}
      >
        <div>
          <p>Bạn có chắc chắn muốn xóa dự án {selectedProject?.name ? <strong>{selectedProject.name}</strong> : 'này'} không?</p>
        </div>
      </CustomModal>
      </div>
    );
  }
