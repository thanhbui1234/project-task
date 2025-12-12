import { motion } from "framer-motion"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { loginSchema, type loginType } from "@/schemas/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { InputField } from "@/components/ui/InputField"
import { Link } from "react-router-dom"
import { useLogin } from "@/hooks/auth/useLogin"
import { URL_PATH } from "@/common/url"
import { useNavigate } from "react-router-dom"
export default function LoginForm() {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<loginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const { login, isPending } = useLogin();
  const handleLogin = (data: loginType) => {
    login(data, {
      onSuccess: () => {
        navigate(URL_PATH.DASHBOARD);
      },
    });
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="max-w-sm mx-auto w-full"
    >
      <Card className="overflow-visible shadow-lg p-6 space-y-4">
        <CardHeader className="flex flex-col justify-center items-center py-4">
          <img src="/logo.png" alt="logo" width={160} height={160} className="mb-2" />
        </CardHeader>

        <form onSubmit={handleSubmit(handleLogin)}>
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
                  className="w-full h-11 text-base font-medium"
                  disabled={isPending}
                >
                  {isPending ? "Đang xử lý..." : "Đăng nhập"}
                </Button>
              </motion.div>

              <div className="text-center justify-evenly flex gap-5 text-sm text-muted-foreground">
                Chưa có tài khoản? 
                <Link className="underline" to="/register">Đăng ký</Link>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}
