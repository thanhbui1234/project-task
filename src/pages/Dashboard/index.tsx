import { useGetDashboard, type IDashboardResponse } from "@/hooks/dashboard/useGetDashboard";
import { DashboardTotal } from "@/components/pages/Dashboard/DashboardTotal";
import { useGetDashboardPercentage, type IDashboardPercentageResponse } from "@/hooks/dashboard/useGetDashboardPercentage";
import { useGetSlowProject } from "@/hooks/dashboard/useGetSlowProject";
import { ChartPieLabel } from "@/components/ui/ChartPie";
import { DataTableDemo } from "@/components/ui/table/TableCommon";
import { taskColumns } from "@/components/ui/table/taskColumns";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { EncryptedText } from "@/components/ui/encrypted-text";

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { data: dashboard } = useGetDashboard();
  const { data: dashboardPercentage } = useGetDashboardPercentage();
  const { data: slowProject, isLoading: isLoadingProject } = useGetSlowProject(
    {
      page: currentPage,
      take: 5,
    }
  );
  console.log('currentPage', currentPage)
  const handlePageChange = (page: number) => {
    console.log('page', page)
    setCurrentPage(page);
  };

  const words = [
    { text: "Welcome back!" },
    { text: "Here's your overview." },
  ];
  return (
    <div className="w-full min-h-screen  p-8">
      <div className="max-w-7xl mx-auto">
        <TypewriterEffectSmooth words={words} />

        <DashboardTotal dashboard={dashboard as IDashboardResponse} />
        <div className="flex flex-col md:flex-row gap-10">
          <div className="mt-8 rounded-xl border w-full md:w-[60%] border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  <EncryptedText
                    text="Danh sách công việc chậm tiến độ"
                    encryptedClassName="text-neutral-400"
                    revealedClassName="text-slate-900 dark:text-white"
                    revealDelayMs={50}
                  />
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Các công việc đang vượt quá thời hạn dự kiến
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="mb-4 h-px w-full bg-slate-200 dark:bg-slate-800" />

            {/* Table */}
            <DataTableDemo
              columns={taskColumns}
              data={slowProject?.docs ?? []}
              meta={slowProject?.meta}
              onPageChange={handlePageChange}
              isLoading={isLoadingProject}
              onRowClick={(task) => navigate(`/task/${task.id}`)}
              showFilter={false}
            />
          </div>
          <ChartPieLabel data={dashboardPercentage as IDashboardPercentageResponse}></ChartPieLabel>
        </div>
      </div>

    </div>
  );
}