import { motion, type Variants } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/InputField';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { createMemberSchema, type createMemberType } from '@/schemas/employee';
import { useCreateEmployee } from '@/hooks/employee/useCreateEmployee';
import { ROLES } from '@/consts/role';
import { UserPlus, Shield, Smartphone, Mail, User, Lock, ChevronRight } from 'lucide-react';

export const CreateEmployee = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<createMemberType>({
    resolver: zodResolver(createMemberSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      role: ROLES.EMPLOYEE,
    },
  });

  const { createEmployee, isPending } = useCreateEmployee();

  const handleCreate = (data: createMemberType) => {
    createEmployee(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl"
      >
        <Card className="border-none shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />

          <CardHeader className="space-y-1 pb-8 pt-10 px-8 text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4 ring-8 ring-blue-50/50 dark:ring-blue-900/10"
            >
              <UserPlus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Tạo thành viên mới
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Thêm nhân viên mới vào hệ thống và phân quyền truy cập phù hợp.
            </p>
          </CardHeader>

          <form onSubmit={handleSubmit(handleCreate)}>
            <CardContent className="px-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tên */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    <User className="w-4 h-4 text-blue-500" />
                    <Label htmlFor="name">Họ và tên</Label>
                  </div>
                  <InputField
                    name="name"
                    control={control}
                    placeholder="Nguyễn Văn A"
                    errors={errors}
                    className="h-11 rounded-xl"
                    label=""
                  />
                </motion.div>

                {/* Email */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <Label htmlFor="email">Email</Label>
                  </div>
                  <InputField
                    name="email"
                    control={control}
                    placeholder="email@example.com"
                    errors={errors}
                    className="h-11 rounded-xl"
                    label=""
                  />
                </motion.div>

                {/* Số điện thoại */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    <Smartphone className="w-4 h-4 text-blue-500" />
                    <Label htmlFor="phone">Số điện thoại</Label>
                  </div>
                  <InputField
                    name="phone"
                    control={control}
                    placeholder="09xx xxx xxx"
                    errors={errors}
                    className="h-11 rounded-xl"
                    label=""
                  />
                </motion.div>

                {/* Vai trò */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <Label htmlFor="role">Vai trò</Label>
                  </div>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="h-11 rounded-xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-950">
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 shadow-xl">
                          <SelectItem value={ROLES.EMPLOYEE} className="rounded-lg my-1">
                            Nhân viên (Employee)
                          </SelectItem>
                          <SelectItem value={ROLES.DIRECTOR} className="rounded-lg my-1">
                            Giám đốc (Director)
                          </SelectItem>
                          <SelectItem value={ROLES.CUSTOMER} className="rounded-lg my-1">
                            Khách hàng (Customer)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.role && (
                    <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>
                  )}
                </motion.div>

                {/* Mật khẩu */}
                <motion.div variants={itemVariants} className="md:col-span-2 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    <Lock className="w-4 h-4 text-blue-500" />
                    <Label htmlFor="password">Mật khẩu ban đầu</Label>
                  </div>
                  <InputField
                    name="password"
                    type="password"
                    control={control}
                    placeholder="••••••••"
                    errors={errors}
                    className="h-11 rounded-xl"
                    label=""
                  />
                </motion.div>
              </div>
            </CardContent>

            <CardFooter className="px-8 pb-10 pt-6">
              <motion.div
                className="w-full"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-12 w-full text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  {isPending ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      Tạo tài khoản ngay
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </motion.div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}