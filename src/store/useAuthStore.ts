import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface UserInfo {
  id: number,
  email: string,
  phoneNumber: string,
  role: string,
  status: string,
  name: string
}

interface AuthState {
  user: UserInfo | null
  login: (user: UserInfo) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      login: (user) => set({ user }),

      logout: () => set({ user: null }),
    }),
    {
      name: "userInfo",
    }
  )
)
