import type { Meta } from "./meta";

export interface IEmployee {
  id: string;
  email: string;
  phoneNumber: string | null;
  role: string;
  status: string;
  name: string | null;
}

export interface IEmployeeResponse {
  docs: IEmployee[];
  meta: Meta;
}