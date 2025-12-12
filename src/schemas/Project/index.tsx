import z from "zod";

export const createProjectSchema = z.object({
  client: z.string().min(1),
  name: z.string().min(1),
  status: z.string().min(1),
})
export type ICreateProjectSchema = z.infer<typeof createProjectSchema>;