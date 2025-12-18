"use client"
import { Pie, PieChart } from "recharts"
import { type IDashboardPercentageResponse } from "@/hooks/dashboard/useGetDashboardPercentage"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { EncryptedText } from "./encrypted-text"

export const description = "A pie chart with a label"

const chartConfig = {
  count: {
    label: "Số lượng",
  },
  started: {
    label: "Mới bắt đầu",
    color: "var(--chart-1)",
  },
  rightProcess: {
    label: "Đúng hạn",
    color: "var(--chart-2)",
  },
  slowProcess: {
    label: "Chậm tiến độ",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig



export function ChartPieLabel({ data }: { data: IDashboardPercentageResponse }) {
  const chartData = [
    { status: "started", count: data?.startedTasksCount || 0, fill: "var(--chart-1)" },
    { status: "rightProcess", count: data?.rightProcessTasksCount || 0, fill: "var(--chart-2)" },
    { status: "slowProcess", count: data?.slowProcessTasksCount || 0, fill: "var(--chart-5)" },
  ]

  const legendItems = [
    {
      label: chartConfig.started.label,
      value: data?.startedTasksCount,
      color: chartConfig.started.color,
    },
    {
      label: chartConfig.rightProcess.label,
      value: data?.rightProcessTasksCount,
      color: chartConfig.rightProcess.color,
    },
    {
      label: chartConfig.slowProcess.label,
      value: data?.slowProcessTasksCount,
      color: chartConfig.slowProcess.color,
    },
  ]


  return (
    <Card className="flex flex-col mt-10 w-full md:w-[40%] ">
      <CardHeader className="items-center pb-0">
        <CardTitle>
          <EncryptedText
            text="Báo cáo tiến độ"
            encryptedClassName="text-neutral-400"
            revealedClassName="text-slate-900 dark:text-white"
            revealDelayMs={50}
          />
        </CardTitle>
        <CardDescription>Thống kê trạng thái công việc</CardDescription>
      </CardHeader>
      <CardContent className="pb-0 flex flex-row items-center gap-6">
        <ChartContainer
          config={chartConfig}
          className="w-[300px] h-[300px] shrink-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            />
          </PieChart>
        </ChartContainer>
        <div className="ml-4 flex flex-col gap-3 justify-center">
          {legendItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted"
            >
              <span
                className="h-3.5 w-3.5 rounded-full ring-2 ring-background"
                style={{ backgroundColor: item.color }}
              />

              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {item.label}
                </span>
                <span className="text-sm font-semibold tabular-nums">
                  {item.value ?? 0}
                </span>
              </div>
            </div>
          ))}
        </div>

      </CardContent>

    </Card>
  )
}
