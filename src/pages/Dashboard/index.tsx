import {
  useGetDashboard,
  type IDashboardResponse,
} from '@/hooks/dashboard/useGetDashboard';
import { DashboardTotal } from '@/components/pages/Dashboard/DashboardTotal';
import {
  useGetDashboardPercentage,
  type IDashboardPercentageResponse,
} from '@/hooks/dashboard/useGetDashboardPercentage';
import { useGetSlowProject } from '@/hooks/dashboard/useGetSlowProject';
import { ChartPieLabel } from '@/components/ui/ChartPie';
import { DataTableDemo } from '@/components/ui/table/TableCommon';
import { taskColumns } from '@/components/ui/table/taskColumns';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';
import { EncryptedText } from '@/components/ui/encrypted-text';
import { useGetMyProject } from '@/hooks/dashboard/useGetMyProject';
import { useAuthStore } from '@/store/useAuthStore';
import { useGetMe } from '@/hooks/profile/useGetMe';
import ListMolbie from '@/components/ui/ListMolbie';
import { useIsMobile } from '@/hooks/use-mobile';
export default function Dashboard() {
  const isMobile = useIsMobile();
  const { data: profile } = useGetMe();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageMyProject, setCurrentPageMyProject] = useState(1);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { data: dashboard } = useGetDashboard();
  const { data: dashboardPercentage } = useGetDashboardPercentage();
  const { data: slowProject, isLoading: isLoadingProject } = useGetSlowProject({
    page: currentPage,
    take: 5,
  });
  const { data: myProject, isLoading: isLoadingMyProject } = useGetMyProject({
    page: currentPageMyProject,
    take: 5,
    userId: user?.id,
  });

  const handlePageChange = (page: number) => {
    console.log('page', page);
    setCurrentPage(page);
  };

  const handlePageChangeMyProject = (page: number) => {
    console.log('page', page);
    setCurrentPageMyProject(page);
  };

  const words = [
    { text: 'Welcome' },
    { text: 'back,' },
    {
      text: profile?.name ? `${profile.name}!` : 'User!',
      className: 'text-blue-500 dark:text-blue-500',
    },
  ];
  return (
    <div className="min-h-screen w-full p-8">
      <div className="mx-auto max-w-7xl">
        <TypewriterEffectSmooth words={words} />

        <DashboardTotal dashboard={dashboard as IDashboardResponse} />
        <div className="flex flex-col gap-10 md:flex-row">
          <div className="mt-8 w-full rounded-xl border border-slate-200 bg-white p-4 md:w-[60%] dark:border-slate-800 dark:bg-slate-950">
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

            <div className="mb-4 h-px w-full bg-slate-200 dark:bg-slate-800" />
            {isMobile ? (
              <ListMolbie data={slowProject?.docs ?? []} />
            ) : (
              <DataTableDemo
                columns={taskColumns}
                data={slowProject?.docs ?? []}
                meta={slowProject?.meta}
                onPageChange={handlePageChange}
                isLoading={isLoadingProject}
                onRowClick={(task) => navigate(`/task/${task.id}`)}
                showFilter={false}
              />
            )}
          </div>
          <ChartPieLabel
            data={dashboardPercentage as IDashboardPercentageResponse}
          ></ChartPieLabel>
        </div>
        <div className="mt-8 w-full rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                <EncryptedText
                  text="Danh sách công việc của tôi"
                  encryptedClassName="text-neutral-400"
                  revealedClassName="text-slate-900 dark:text-white"
                  revealDelayMs={50}
                />
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Các công việc được giao cho tôi
              </p>
            </div>
          </div>
          {isMobile ? (
            <ListMolbie data={myProject?.docs ?? []} />
          ) : (
            <DataTableDemo
              columns={taskColumns}
              data={myProject?.docs ?? []}
              meta={myProject?.meta}
              onPageChange={handlePageChangeMyProject}
              isLoading={isLoadingMyProject}
              onRowClick={(task) => navigate(`/task/${task.id}`)}
              showFilter={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}
