import { createFileRoute } from '@tanstack/react-router'
import { useAdminRooms } from '@/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Home, DollarSign, Eye } from 'lucide-react'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const { data } = useAdminRooms()
  const rooms = data?.data ?? []

  const stats = {
    total: rooms.length,
    forRent: rooms.filter((r) => r.type === 'rent').length,
    forSale: rooms.filter((r) => r.type === 'sale').length,
    available: rooms.filter((r) => r.is_available).length,
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-stone-800">Dashboard</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-stone-500">Total Rooms</CardTitle>
            <Home className="h-4 w-4 text-stone-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-stone-500">For Rent</CardTitle>
            <DollarSign className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.forRent}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-stone-500">For Sale</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{stats.forSale}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-stone-500">Available</CardTitle>
            <Eye className="h-4 w-4 text-stone-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800">{stats.available}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
