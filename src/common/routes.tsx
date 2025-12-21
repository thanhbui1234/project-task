import { type RouteProps } from 'react-router-dom';
import LoginPage from '@/pages/Auth/Login';
import RegisterForm from '@/pages/Auth/Register';
import Dashboard from '@/pages/Dashboard';
import { URL_PATH } from './url';
import Project from '@/pages/Project';
import { ProjectDetail } from '@/pages/Project/ProjectDetail';
import { TaskDetail } from '@/pages/Project/TaskDetail';
import { Profile } from '@/components/pages/Profile';
import { Employees } from '@/pages/Employees';
import { CreateEmployee } from '@/pages/Employees/createEmployee';
type ExtendedRoute = RouteProps & {
  permissions?: string[]; // Permissions required for the route
};

export const publicRoutes: ExtendedRoute[] = [
  {
    path: URL_PATH.LOGIN,
    element: <LoginPage />,
  },
  {
    path: URL_PATH.REGISTER,
    element: <RegisterForm />,
  },
].map((item) => ({ ...item, isPublic: true }));

export const privateRoutes: ExtendedRoute[] = [
  {
    path: URL_PATH.DASHBOARD,
    element: <Dashboard />,
  },
  {
    path: URL_PATH.PROJECT,
    element: <Project />,
  },
  {
    path: URL_PATH.PROJECT_DETAIL,
    element: <ProjectDetail />,
  },
  {
    path: URL_PATH.TASK_DETAIL,
    element: <TaskDetail />,
  },
  {
    path: URL_PATH.PROFILE,
    element: <Profile />,
  }, {
    path: URL_PATH.EMPLOYEE,
    element: <Employees />,
  },
  {
    path: URL_PATH.CREATE_PROFILE,
    element: <CreateEmployee />,
  }
];
