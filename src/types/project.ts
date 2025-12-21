import type { Meta } from '@/types/meta';
import type { IEmployee } from './employee';

export interface IProject {
  id: string;
  name: string;
  client: string;
  customers: string[];
  status: string;
  owner: IEmployee;
  taskCount: number;
  createdAt: number;
  startAt: number;
  endAt: number;
}

export interface IProjectResponse {
  docs: IProject[];
  meta: Meta;
}
