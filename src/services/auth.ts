import api from './api'

type RegisterDataType = {
    username: string
    email: string
    password: string
}

export const register = async (data: RegisterDataType) => {
    const res = await api.post('/auth/register', data);
    return res.data;
}

export const refreshTokens = async (refreshToken: string) => {
  const res = await api.post("/auth/refresh", { token: refreshToken })
  return res.data
}

export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password })
  return res.data
}

export const getMyDetails = async () => {
  const res = await api.get("/auth/me")
  return res.data
}

export const updateMyDetails = async (userId: string, data: any) => {
  const res = await api.put(`/auth/${userId}`, data)
  return res.data
}