import { ROLES } from '../consts/role';
import { useAuthStore } from '@/store/useAuthStore';

export const isDirector = () => {
  const user = useAuthStore.getState().user;
  return user?.role === ROLES.DIRECTOR;
};
