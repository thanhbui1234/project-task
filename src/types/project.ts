import type { Meta } from "@/types/meta";
export interface IProject {
  id: string;
  name: string;
  client: string;
  status: string;
  owner: string;
  taskCount: number;
}

export interface IProjectResponse {
  docs: IProject[];
  meta: Meta;
}