export interface IFile {
  id: string;
  path: string;
  type: string;
  projectId: string | null;
  taskId: string | null;
  createdAt: number;
}