import { createFileRoute, Link } from '@tanstack/react-router'
import { useRoom } from '@/hooks'
import { Button, Card, CardContent } from '@/components/ui'
import { Bed, Bath, Maximize, MapPin, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/rooms/$id')({
  component: RoomDetailPage,
})

function RoomDetailPage() {
  const { id } = Route.useParams()
  const { data: room, isLoading } = useRoom(Number(id))

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="text-center text-stone-500">Loading...</div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="text-center text-stone-500">Room not found</div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-stone-600 hover:text-amber-700">
        <ArrowLeft className="h-4 w-4" />
        Back to listings
      </Link>

      <div className="mb-6">
        {room.media && room.media.length > 0 ? (
          <div className="grid gap-2">
            <div className="aspect-video overflow-hidden rounded-lg bg-stone-100">
              <img
                src={room.media[0].original_url}
                alt={room.name}
                className="h-full w-full object-cover"
              />
            </div>
            {room.media.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {room.media.slice(1, 5).map((media) => (
                  <div key={media.id} className="aspect-video overflow-hidden rounded-lg bg-stone-100">
                    <img
                      src={media.original_url}
                      alt={room.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-lg bg-stone-100 text-stone-400">
            No images
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                room.type === 'rent'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {room.type === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
            {room.is_available ? (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                Available
              </span>
            ) : (
              <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                Not Available
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-stone-800">{room.name}</h1>
          <p className="mt-2 flex items-center gap-2 text-stone-600">
            <MapPin className="h-5 w-5" />
            {room.address}
          </p>

          <div className="mt-6 flex gap-6 text-stone-600">
            <div className="flex items-center gap-2">
              <Bed className="h-5 w-5" />
              <span>{room.bedrooms} Bedrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-5 w-5" />
              <span>{room.bathrooms} Bathrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <Maximize className="h-5 w-5" />
              <span>{room.area} sqft</span>
            </div>
          </div>

          {room.description && (
            <div className="mt-8">
              <h2 className="mb-3 text-xl font-semibold text-stone-800">Description</h2>
              <p className="whitespace-pre-line text-stone-600">{room.description}</p>
            </div>
          )}
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 text-center">
                <span className="text-3xl font-bold text-stone-800">
                  ${(room.price ?? 0).toLocaleString()}
                </span>
                {room.type === 'rent' && (
                  <span className="text-stone-500">/month</span>
                )}
              </div>
              <Button className="w-full">Contact Owner</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
