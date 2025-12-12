import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/ui/DialogCustom";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectSchema } from "@/schemas/Project";
import { ProjectFormContent } from "@/components/pages/Project/FormCreatProject";
import { useCreatProject } from "@/hooks/project/useCreatProject";
import { useGetProjects } from "@/hooks/project/useGetProject";
import { ProjectGrid } from "@/components/pages/Project/CardProject";
import type { IProject } from "@/types/project";

export default function Projects() {
  const [openModal, setOpenModal] = useState(false);
  const { createProject, isPending } = useCreatProject();
  const { data, isFetching } = useGetProjects();
  const form = useForm({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      client: "",
      status: ""
    },
  });

  const onSubmit = (data: createProjectSchema) => {
    createProject(data);
    setOpenModal(false);
    form.reset();
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

      <ProjectGrid projects={data?.docs as IProject[]} isFetching={isFetching} />

      <FormProvider {...form}>
        <CustomModal
          open={openModal}
          onOpenChange={setOpenModal}
          title="Thêm dự án mới"
          description="Nhập thông tin dự án."
          confirmText="Tạo dự án"
          onConfirm={form.handleSubmit(onSubmit)}
          loading={isPending}
        >
          <ProjectFormContent />
        </CustomModal>
      </FormProvider>


    </div>
  );
}