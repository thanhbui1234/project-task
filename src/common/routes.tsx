import { type RouteProps } from 'react-router-dom';
import LoginPage from '@/pages/Auth/Login';
import RegisterForm from '@/pages/Auth/Register';
import Dashboard from '@/pages/Dashboard';
import { URL_PATH } from './url';
import Project from '@/pages/Project';
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
];
