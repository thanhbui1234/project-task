// src/utils/auth.utils.ts

const ACCESS_TOKEN_KEY = "access_token"
const USER_KEY = "auth_user"

const isBrowser = typeof window !== "undefined"

/* ----------------------- TOKEN ----------------------- */
export const setToken = (token: string) => {
  if (!isBrowser) return
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export const getToken = () => {
  if (!isBrowser) return null
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export const removeToken = () => {
  if (!isBrowser) return
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

/* ----------------------- USER ------------------------ */
export const setUser = (user: unknown) => {
  if (!isBrowser) return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const getUser = () => {
  if (!isBrowser) return null
  try {
    const data = localStorage.getItem(USER_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export const removeUser = () => {
  if (!isBrowser) return
  localStorage.removeItem(USER_KEY)
}

/* ----------------------- CLEAR ALL ----------------------- */
export const clearAuth = () => {
  removeToken()
  removeUser()
}


import { useAuthStore } from "@/store/useAuthStore"
import type { UserInfo } from "@/store/useAuthStore"
export const auth = {
  login: (user: UserInfo) => {
    useAuthStore.getState().login(user)
  },
  logout: () => useAuthStore.getState().logout(),
}
