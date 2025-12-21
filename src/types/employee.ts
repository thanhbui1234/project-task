import type { Meta } from './meta';

export interface IEmployee {
  id: string;
  email: string;
  phoneNumber: string | null;
  role: string;
  status: string;
  name: string | null;
  avatar_id?: string;
  avatar?: {
    id: string;
    path: string;
    type: string;
  };
}

export interface IEmployeeResponse {
  docs: IEmployee[];
  meta: Meta;
}
