import { createFileRoute, Link } from '@tanstack/react-router'
import { useAdminRooms, useDeleteRoom, useToast } from '@/hooks'
import { Button, Card } from '@/components/ui'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export const Route = createFileRoute('/admin/rooms/')({
  component: AdminRoomsList,
})

function AdminRoomsList() {
  const { data, isLoading } = useAdminRooms()
  const deleteRoom = useDeleteRoom()
  const { addToast } = useToast()

  const rooms = data?.data ?? []

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this room?')) return
    try {
      await deleteRoom.mutateAsync(id)
      addToast('Room deleted', 'success')
    } catch {
      addToast('Failed to delete room', 'error')
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800">Rooms</h1>
        <Link to="/admin/rooms/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-stone-500">Loading...</div>
      ) : rooms.length === 0 ? (
        <Card className="p-8 text-center text-stone-500">No rooms yet</Card>
      ) : (
        <div className="overflow-hidden rounded-lg border border-stone-200">
          <table className="w-full">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-stone-600">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-stone-600">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-stone-600">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-stone-600">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-stone-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {rooms.map((room) => (
                <tr key={room.id} className="bg-white hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-stone-800">{room.name}</div>
                    <div className="text-sm text-stone-500">{room.address}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        room.type === 'rent'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {room.type === 'rent' ? 'Rent' : 'Sale'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-stone-600">${(room.price ?? 0).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        room.is_available
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {room.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to="/admin/rooms/$id/edit" params={{ id: String(room.id) }}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(room.id)}
                        disabled={deleteRoom.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
