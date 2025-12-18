import type { Meta } from '@/types/meta';

export interface ITask {
  id: string;
  name: string;
  status: string;
  description: string;
  assignedTo: string | null;
  projectId: string;
  startAt: string | null;
  endAt: string | null;
}

export interface ITaskResponse {
  docs: ITask[];
  meta: Meta;
}
