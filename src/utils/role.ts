import { ROLE } from "@/consts/role";
import { useAuthStore } from "@/store/useAuthStore";

export const getUserRole = () => {
  const user = useAuthStore.getState().user
  return user?.role;
}

export const isDirector = () => {
  const user = getUserRole();
  return user === ROLE.DIRECTOR;
}