import { AlertCircle, CheckCircle2, Users, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IDashboardResponse } from "@/hooks/dashboard/useGetDashboard";
export const DashboardTotal = ({ dashboard }: { dashboard: IDashboardResponse }) => {
   const stats = [
    {
      title: "Completed Tasks",
      value: dashboard?.completeTasksCount || 0,
      icon: CheckCircle2,
      color: "bg-green-500",
    },
    {
      title: "Open Tasks",
      value: dashboard?.openTasksCount || 0,
      icon: AlertCircle,
      color: "bg-orange-500",
    },
    {
      title: "Running Projects",
      value: dashboard?.runningProjectsCount || 0,
      icon: Zap,
      color: "bg-blue-500",
    },
    {
      title: "Users",
      value: dashboard?.usersCount || 0,
      icon: Users,
      color: "bg-purple-500",
    },
  ];

 
  return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className=" transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/50 hover:scale-105 transform"
                style={{
                  animation: `slideUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    {stat.title}
                  </CardTitle>
                  <div className={`${stat.color} p-2 rounded-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {stat.value}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {stat.value > 0 ? "Active" : "No data"}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
  );
};