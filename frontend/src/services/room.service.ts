import { api } from './api'
import type { Room, RoomForm, RoomFilters } from '@/dto'

interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export const roomService = {
  // Public
  async list(filters?: RoomFilters): Promise<PaginatedResponse<Room>> {
    const params = new URLSearchParams()
    if (filters?.type) params.append('type', filters.type)
    if (filters?.min_price) params.append('min_price', String(filters.min_price))
    if (filters?.max_price) params.append('max_price', String(filters.max_price))
    if (filters?.bedrooms) params.append('bedrooms', String(filters.bedrooms))
    if (filters?.search) params.append('search', filters.search)

    const res = await api.get<PaginatedResponse<Room>>(`/rooms?${params}`)
    return res.data
  },

  async get(id: number): Promise<Room> {
    const res = await api.get<Room>(`/rooms/${id}`)
    return res.data
  },

  // Admin
  async adminList(): Promise<PaginatedResponse<Room>> {
    const res = await api.get<PaginatedResponse<Room>>('/room')
    return res.data
  },

  async adminGet(id: number): Promise<Room> {
    const res = await api.get<Room>(`/room/${id}`)
    return res.data
  },

  async create(data: RoomForm): Promise<Room> {
    const res = await api.post<Room>('/room', data)
    return res.data
  },

  async update(id: number, data: RoomForm): Promise<Room> {
    const res = await api.put<Room>(`/room/${id}`, data)
    return res.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/room/${id}`)
  },

  async uploadImages(id: number, files: File[]): Promise<Room> {
    const formData = new FormData()
    files.forEach((file) => formData.append('images[]', file))
    const res = await api.post<Room>(`/room/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },
}
