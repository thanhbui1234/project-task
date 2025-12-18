import z from "zod";

/* ================= Schema ================= */
export const profileSchema = z
  .object({
    name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    phoneNumber: z.string().min(9, 'Số điện thoại không hợp lệ'),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    avatarId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.password && !data.confirmPassword) return true;
      return data.password === data.confirmPassword;
    },
    {
      message: 'Mật khẩu không khớp',
      path: ['confirmPassword'],
    }
  );

export type IProfileSchema = z.infer<typeof profileSchema>;