// import { motion } from "framer-motion";
// import { Card, CardContent } from "@/components/ui/card";
// import { User } from "lucide-react";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import type { ITask } from "@/types/task";
// export const RightSideBar = (task: ITask) => {
//   return (
//           <motion.div className="space-y-4" variants={containerVariants}>
//             {/* Details Card */}
//             <motion.div variants={sidebarItemVariants}>
//               <Card className="overflow-hidden border-0 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
//                 <CardContent className="p-0">
//                   {/* Header */}
//                   <div className="border-b bg-linear-to-r from-slate-50 to-slate-100 px-5 py-4 dark:from-slate-800 dark:to-slate-800/50">
//                     <h3 className="text-foreground font-semibold">Chi tiết</h3>
//                   </div>

//                   {/* Details List */}
//                   <div className="divide-y">
//                     {/* Assignee */}
//                     <motion.div
//                       className="group flex items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
//                       whileHover={{ x: 2 }}
//                     >
//                       <div className="text-muted-foreground flex items-center gap-2 text-sm">
//                         <User className="h-4 w-4" />
//                         <span>Người thực hiện</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Avatar className="h-7 w-7">
//                           <AvatarFallback className="bg-linear-to-br from-emerald-400 to-teal-500 text-xs font-medium text-white">
//                             {getInitials(getEmployeeName(task.assignedTo))}
//                           </AvatarFallback>
//                         </Avatar>
//                         <span className="text-sm font-medium">
//                           {getEmployeeName(task.assignedTo) ?? 'Chưa giao'}
//                         </span>
//                         <Button
//                           variant="ghost"
//                           size="icon-sm"
//                           onClick={() => setIsEditModalOpen(true)}
//                           className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
//                         >
//                           <Edit3 className="h-3 w-3" />
//                         </Button>
//                       </div>
//                     </motion.div>

//                     {/* Status */}
//                     <motion.div
//                       className="group flex items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
//                       whileHover={{ x: 2 }}
//                     >
//                       <div className="text-muted-foreground flex items-center gap-2 text-sm">
//                         <Flag className="h-4 w-4" />
//                         <span>Trạng thái</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Badge
//                           className={`${statusConfig.bgLight} ${statusConfig.textColor} border-0 font-medium`}
//                         >
//                           <StatusIcon className="mr-1 h-3 w-3" />
//                           {statusConfig.label}
//                         </Badge>
//                         <Button
//                           variant="ghost"
//                           size="icon-sm"
//                           onClick={() => setIsEditModalOpen(true)}
//                           className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
//                         >
//                           <Edit3 className="h-3 w-3" />
//                         </Button>
//                       </div>
//                     </motion.div>

//                     {/* Start Date */}
//                     <motion.div
//                       className="group flex items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
//                       whileHover={{ x: 2 }}
//                     >
//                       <div className="text-muted-foreground flex items-center gap-2 text-sm">
//                         <Calendar className="h-4 w-4" />
//                         <span>Ngày bắt đầu</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <span className="text-sm font-medium">
//                           {task.startAt
//                             ? new Date(task.startAt).toLocaleDateString(
//                               'vi-VN',
//                               {
//                                 day: '2-digit',
//                                 month: 'short',
//                                 year: 'numeric',
//                               }
//                             )
//                             : '-'}
//                         </span>
//                         <Button
//                           variant="ghost"
//                           size="icon-sm"
//                           onClick={() => setIsEditModalOpen(true)}
//                           className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
//                         >
//                           <Edit3 className="h-3 w-3" />
//                         </Button>
//                       </div>
//                     </motion.div>

//                     {/* End Date */}
//                     <motion.div
//                       className="group flex items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
//                       whileHover={{ x: 2 }}
//                     >
//                       <div className="text-muted-foreground flex items-center gap-2 text-sm">
//                         <Calendar className="h-4 w-4" />
//                         <span>Ngày kết thúc</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <span className="text-sm font-medium">
//                           {task.endAt
//                             ? new Date(task.endAt).toLocaleDateString('vi-VN', {
//                               day: '2-digit',
//                               month: 'short',
//                               year: 'numeric',
//                             })
//                             : '-'}
//                         </span>
//                         <Button
//                           variant="ghost"
//                           size="icon-sm"
//                           onClick={() => setIsEditModalOpen(true)}
//                           className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
//                         >
//                           <Edit3 className="h-3 w-3" />
//                         </Button>
//                       </div>
//                     </motion.div>

//                     <Separator />

//                     {/* Project */}
//                     <motion.div
//                       className="group flex items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
//                       whileHover={{ x: 2 }}
//                     >
//                       <div className="text-muted-foreground flex items-center gap-2 text-sm">
//                         <div className="flex h-4 w-4 items-center justify-center rounded bg-blue-500">
//                           <span className="text-[10px] font-bold text-white">
//                             P
//                           </span>
//                         </div>
//                         <span>Project</span>
//                       </div>
//                       <span className="cursor-pointer text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-400">
//                         {task.projectId}
//                       </span>
//                     </motion.div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>

//             {/* Quick Actions Card */}
//             <motion.div variants={sidebarItemVariants}>
//               <Card className="overflow-hidden border-0 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
//                 <CardContent className="p-4">
//                   <h3 className="text-muted-foreground mb-3 text-sm font-semibold">
//                     Thao tác nhanh
//                   </h3>
//                   <div className="grid grid-cols-2 gap-2">
//                     <motion.div
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                     >
//                       <Button
//                         variant="outline"
//                         onClick={() => setIsEditModalOpen(true)}
//                         className="h-auto w-full flex-col gap-1 rounded-xl py-3 transition-all hover:border-blue-200 hover:bg-blue-50 dark:hover:border-blue-800 dark:hover:bg-blue-950/30"
//                       >
//                         <Edit3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
//                         <span className="text-xs">Chỉnh sửa</span>
//                       </Button>
//                     </motion.div>

//                     <motion.div
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                     >
//                       <Button
//                         variant="outline"
//                         onClick={handleMarkComplete}
//                         disabled={task.status === STATUS_TASK.COMPLETED}
//                         className="h-auto w-full flex-col gap-1 rounded-xl py-3 transition-all hover:border-emerald-200 hover:bg-emerald-50 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30"
//                       >
//                         <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
//                         <span className="text-xs">Hoàn thành</span>
//                       </Button>
//                     </motion.div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           </motion.div>
//   );
// };

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.08,
//       delayChildren: 0.1,
//     },
//   },
// } as const;

// const sidebarItemVariants = {
//   hidden: { opacity: 0, x: 20 },
//   visible: {
//     opacity: 1,
//     x: 0,
//     transition: {
//       type: 'spring' as const,
//       stiffness: 100,
//       damping: 15,
//     },
//   },
// };
