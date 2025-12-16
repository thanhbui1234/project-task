import z from 'zod';

/* ------------------ Project ------------------ */
export const createProjectSchema = z.object({
  client: z.string().min(1, {
    message: 'Client không được để trống',
  }),
  name: z.string().min(1, {
    message: 'Tên project không được để trống',
  }),
  status: z.string().min(1, {
    message: 'Trạng thái project không được để trống',
  }),
});

export type ICreateProjectSchema = z.infer<typeof createProjectSchema>;

/* ------------------ Task ------------------ */
export const taskSchema = z
  .object({
    id: z.string().min(1, {
      message: 'ID task không được để trống',
    }),
    name: z.string().min(1, {
      message: 'Tên task không được để trống',
    }),
    description: z.string().min(1, {
      message: 'Mô tả task không được để trống',
    }),
    status: z.string().min(1, {
      message: 'Trạng thái task không được để trống',
    }),
    assignedTo: z
      .string()
      .min(1, {
        message: 'Người được giao task không hợp lệ',
      })
      .optional(),
    startAt: z
      .string()
      .min(1, {
        message: 'Ngày bắt đầu không hợp lệ',
      })
      .optional(),
    endAt: z
      .string()
      .min(1, {
        message: 'Ngày kết thúc không hợp lệ',
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startAt && data.endAt) {
      const start = new Date(data.startAt).getTime();
      const end = new Date(data.endAt).getTime();

      if (isNaN(start) || isNaN(end)) {
        ctx.addIssue({
          path: ['endAt'],
          message: 'Ngày bắt đầu hoặc ngày kết thúc không đúng định dạng',
          code: z.ZodIssueCode.custom,
        });
        return;
      }

      if (end <= start) {
        ctx.addIssue({
          path: ['endAt'],
          message: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export type ITaskSchema = z.infer<typeof taskSchema>;

/* ------------------ Create Task (without id) ------------------ */
export const createTaskSchema = z
  .object({
    name: z.string().min(1, {
      message: 'Tên task không được để trống',
    }),
    description: z.string().min(1, {
      message: 'Mô tả task không được để trống',
    }),
    status: z.string().min(1, {
      message: 'Trạng thái task không được để trống',
    }),

    startAt: z.preprocess(
      (val) => (val instanceof Date ? val.getTime() : val),
      z.number().optional()
    ),

    endAt: z.preprocess(
      (val) => (val instanceof Date ? val.getTime() : val),
      z.number().optional()
    ),
  })
  .superRefine((data, ctx) => {
    if (data.startAt && data.endAt) {
      if (data.endAt <= data.startAt) {
        ctx.addIssue({
          path: ['endAt'],
          message: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export type ICreateTaskSchema = z.infer<typeof createTaskSchema>;
