import { z } from 'zod';
import { ROLES } from '@/consts/role';

export const createMemberSchema = z.object({
  name: z.string().min(1, 'Họ tên không được để trống'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  phoneNumber: z.string().min(10, 'Số điện thoại không hợp lệ'),
  role: z.enum([ROLES.DIRECTOR, ROLES.EMPLOYEE, ROLES.CUSTOMER], {
    message: 'Vui lòng chọn vai trò',
  }),
});

export type createMemberType = z.infer<typeof createMemberSchema>;
