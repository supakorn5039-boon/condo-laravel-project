import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { roomService } from '@/services'
import type { RoomForm, RoomFilters } from '@/dto'

export function useRooms(filters?: RoomFilters) {
  return useQuery({
    queryKey: ['rooms', filters],
    queryFn: () => roomService.list(filters),
  })
}

export function useRoom(id: number) {
  return useQuery({
    queryKey: ['room', id],
    queryFn: () => roomService.get(id),
    enabled: !!id,
  })
}

export function useAdminRooms() {
  return useQuery({
    queryKey: ['admin-rooms'],
    queryFn: () => roomService.adminList(),
  })
}

export function useAdminRoom(id: number) {
  return useQuery({
    queryKey: ['admin-room', id],
    queryFn: () => roomService.adminGet(id),
    enabled: !!id,
  })
}

export function useCreateRoom() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: RoomForm) => roomService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rooms'] })
    },
  })
}

export function useUpdateRoom(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: RoomForm) => roomService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rooms'] })
      queryClient.invalidateQueries({ queryKey: ['admin-room', id] })
    },
  })
}

export function useDeleteRoom() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => roomService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rooms'] })
    },
  })
}

export function useUploadImages(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (files: File[]) => roomService.uploadImages(id, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-room', id] })
    },
  })
}
