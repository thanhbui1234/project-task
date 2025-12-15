"use client"

import { FormCreatTask } from "@/components/pages/Project/ProjectDetail/FormCreatTask"
import { CustomModal } from "@/components/ui/DialogCustom"
import { taskColumns, type TaskTableMeta } from "@/components/ui/table/taskColumns"
import { DataTableDemo } from "@/components/ui/table/TableCommon"
import { STATUS_TASK } from "@/consts/statusProject"
import { useGetEmployee } from "@/hooks/employee/useGetEmployee"
import { useCreatTask } from "@/hooks/task/useCreateTask"
import { useGetTasks } from "@/hooks/task/useGetTask"
import { createTaskSchema, type ICreateTaskSchema } from "@/schemas/Project"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import { TAKE_PAGE } from "@/consts/query"

export const ProjectDetail = () => {
  const { id: projectId } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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
      name: "",
      description: "",
      status: STATUS_TASK.STARTED,
      startAt: undefined,
      endAt: undefined,
    },
  });

  // Memo tableMeta để tránh re-render không cần thiết
  const tableMeta = useMemo<TaskTableMeta>(() => ({
    employees: employees?.docs ?? [],
  }), [employees?.docs]);

  const handleAdd = () => {
    setOpenModal(true)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const onSubmit = (data: ICreateTaskSchema) => {
    console.log(data);
    createTask(data as unknown as ICreateTaskSchema);
    setOpenModal(false);
    form.reset();
  }

  return (
    <>
      <div className="container mx-auto p-10 border rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Chi tiết dự án</h1>
        </div>
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
  )
}
