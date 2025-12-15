import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useRooms } from '@/hooks'
import { Card, CardContent, Button, Input, Select } from '@/components/ui'
import { Bed, Bath, Maximize, MapPin } from 'lucide-react'
import type { RoomFilters } from '@/dto'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const [filters, setFilters] = useState<RoomFilters>({})
  const { data, isLoading } = useRooms(filters)

  const rooms = data?.data ?? []

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800">Find Your Perfect Room</h1>
        <p className="mt-2 text-stone-600">Browse available rooms for rent or sale</p>
      </div>

      <div className="mb-8 flex flex-wrap gap-4">
        <Input
          placeholder="Search by name..."
          className="w-64"
          value={filters.search ?? ''}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <Select
          className="w-40"
          value={filters.type ?? ''}
          onChange={(e) => setFilters({ ...filters, type: e.target.value as RoomFilters['type'] })}
        >
          <option value="">All Types</option>
          <option value="rent">For Rent</option>
          <option value="sale">For Sale</option>
        </Select>
        <Select
          className="w-40"
          value={filters.bedrooms ?? ''}
          onChange={(e) => setFilters({ ...filters, bedrooms: Number(e.target.value) || undefined })}
        >
          <option value="">Bedrooms</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
        </Select>
        <Button variant="outline" onClick={() => setFilters({})}>
          Clear
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center text-stone-500">Loading...</div>
      ) : rooms.length === 0 ? (
        <div className="text-center text-stone-500">No rooms found</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Link key={room.id} to="/rooms/$id" params={{ id: String(room.id) }}>
              <Card className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="aspect-video bg-stone-100">
                  {room.media?.[0] ? (
                    <img
                      src={room.media[0].original_url}
                      alt={room.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-stone-400">
                      No image
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        room.type === 'rent'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {room.type === 'rent' ? 'For Rent' : 'For Sale'}
                    </span>
                    <span className="text-lg font-bold text-stone-800">
                      ${(room.price ?? 0).toLocaleString()}
                      {room.type === 'rent' && <span className="text-sm font-normal text-stone-500">/mo</span>}
                    </span>
                  </div>
                  <h3 className="font-semibold text-stone-800">{room.name}</h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-stone-500">
                    <MapPin className="h-3 w-3" />
                    {room.address}
                  </p>
                  <div className="mt-3 flex gap-4 text-sm text-stone-600">
                    <span className="flex items-center gap-1">
                      <Bed className="h-4 w-4" /> {room.bedrooms}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-4 w-4" /> {room.bathrooms}
                    </span>
                    <span className="flex items-center gap-1">
                      <Maximize className="h-4 w-4" /> {room.area} sqft
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
