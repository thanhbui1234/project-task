import z from 'zod';

const isValidDate = (val: unknown) => {
  if (!val) return false;

  // Number (timestamp)
  if (typeof val === 'number') return !isNaN(val) && val > 0;

  // Date
  if (val instanceof Date) return !isNaN(val.getTime());

  // dayjs / moment
  if (typeof val === 'object' && 'toDate' in val) {
    const d = (val as { toDate: () => Date }).toDate();
    return d instanceof Date && !isNaN(d.getTime());
  }

  return false;
};

/* ------------------ Project ------------------ */
export const createProjectSchema = z
  .object({
    client: z.string().min(1, 'Client không được để trống'),
    name: z.string().min(1, 'Tên project không được để trống'),
    status: z.string().min(1, 'Trạng thái project không được để trống'),

    startAt: z.any().refine(isValidDate, {
      message: 'Ngày bắt đầu không được để trống',
    }),

    endAt: z.any().refine(isValidDate, {
      message: 'Ngày kết thúc không được để trống',
    }),
  })
  .superRefine((data, ctx) => {
    // Convert to timestamp for comparison
    const toTimestamp = (val: unknown): number | null => {
      if (typeof val === 'number') return val;
      if (val instanceof Date) return val.getTime();
      if (typeof val === 'object' && val && 'toDate' in val) {
        return (val as { toDate: () => Date }).toDate().getTime();
      }
      return null;
    };

    const start = toTimestamp(data.startAt);
    const end = toTimestamp(data.endAt);

    if (start && end && end <= start) {
      ctx.addIssue({
        path: ['endAt'],
        message: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
        code: z.ZodIssueCode.custom,
      });
    }
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

/* ------------------ Update Task (with taskId) ------------------ */
export const updateTaskSchema = z
  .object({
    taskId: z.string().min(1, {
      message: 'ID task không được để trống',
    }),
    name: z.string().min(1, {
      message: 'Tên task không được để trống',
    }),
    description: z.string().optional(),
    status: z.string().min(1, {
      message: 'Trạng thái task không được để trống',
    }),
    assignedTo: z.string().optional(),
    startAt: z.number().optional(),
    endAt: z.number().optional(),
    priority: z.string().optional(),
    fileIds: z.array(z.string()).optional(),
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

export type IUpdateTaskSchema = z.infer<typeof updateTaskSchema>;
