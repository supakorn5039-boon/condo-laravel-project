import { api } from './api'
import type { LoginDto, RegisterDto, User } from '@/dto'

interface AuthResponse {
  token: string
  user: User
}

interface ApiResponse<T> {
  data?: T
  token?: string
  user?: User
}

export const authService = {
  async login(data: LoginDto): Promise<AuthResponse> {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', data)
    // Handle both { data: { token, user } } and { token, user } structures
    if (res.data.data) {
      return res.data.data
    }
    return { token: res.data.token!, user: res.data.user! }
  },

  async register(data: RegisterDto): Promise<AuthResponse> {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', data)
    if (res.data.data) {
      return res.data.data
    }
    return { token: res.data.token!, user: res.data.user! }
  },

  async me(): Promise<User> {
    const res = await api.get<{ data?: User } & User>('/auth/me')
    return res.data.data || res.data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },
}
