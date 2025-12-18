import { useState } from 'react';
import { employeeColumns } from '@/components/ui/table/employeeColumns';
import { DataTableDemo } from '@/components/ui/table/TableCommon';
import { useGetEmployeesTable } from '@/hooks/employee/useGetEmployeeTable';
import { EncryptedText } from '@/components/ui/encrypted-text';

export const Employees = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: employeesData, isLoading } = useGetEmployeesTable({
    page: currentPage,
    take: 10,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen w-full p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mt-8 w-full rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                <EncryptedText
                  text="Danh sách nhân viên"
                  encryptedClassName="text-neutral-400"
                  revealedClassName="text-slate-900 dark:text-white"
                  revealDelayMs={50}
                />
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Quản lý thông tin nhân viên trong hệ thống
              </p>
            </div>
          </div>
          <DataTableDemo
            columns={employeeColumns}
            data={employeesData?.docs ?? []}
            meta={employeesData?.meta}
            onPageChange={handlePageChange}
            isLoading={isLoading}
            showFilter={true}
          />
        </div>
      </div>
    </div>
  );
};