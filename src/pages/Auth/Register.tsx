import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { registerSchema, type registerType } from '@/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { InputField } from '@/components/ui/InputField';
import { Link, useNavigate } from 'react-router-dom';
import { useRegister } from '@/hooks/auth/useRegister';
import { URL_PATH } from '@/common/url';

export default function RegisterForm() {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<registerType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
    },
  });
  const { register, isPending } = useRegister();
  const handleRegister = (data: registerType) => {
    register(data, {
      onSuccess: () => {
        navigate(URL_PATH.LOGIN);
      },
    });
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="mx-auto w-full max-w-sm"
    >
      <Card className="space-y-4 overflow-visible p-6 shadow-lg">
        <CardHeader className="flex flex-col items-center justify-center py-4">
          <img
            src="/logo.png"
            alt="logo"
            width={160}
            height={160}
            className="mb-2"
          />
        </CardHeader>

        <form onSubmit={handleSubmit(handleRegister)}>
          <CardContent className="space-y-5">
            {/* Email */}
            <InputField
              label="Email"
              name="email"
              control={control}
              placeholder="Email"
              errors={errors}
            />

            {/* Password */}
            <InputField
              label="Tên"
              name="name"
              control={control}
              placeholder="Tên"
              errors={errors}
            />

            {/* Password */}
            <InputField
              label="Số điện thoại"
              name="phone"
              control={control}
              placeholder="Số điện thoại"
              errors={errors}
            />

            {/* Password */}
            <InputField
              label="Mật khẩu"
              name="password"
              control={control}
              type="password"
              placeholder="••••••••"
              errors={errors}
            />
          </CardContent>

          <CardFooter className="pt-5">
            <div className="w-full space-y-3">
              <motion.div whileTap={{ scale: 0.99 }}>
                <Button
                  type="submit"
                  className="h-11 w-full text-base font-medium"
                  disabled={isPending}
                >
                  {isPending ? 'Đang xử lý...' : 'Đăng ký'}
                </Button>
              </motion.div>

              <div className="text-muted-foreground flex justify-evenly gap-5 text-center text-sm">
                Đã có tài khoản?{' '}
                <Link className="underline" to="/">
                  Đăng nhập
                </Link>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
