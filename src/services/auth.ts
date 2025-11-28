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