import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { roomFormSchema, type RoomForm } from '@/dto'
import { useCreateRoom, useToast } from '@/hooks'
import { Button, Input, Select, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

export const Route = createFileRoute('/admin/rooms/new')({
  component: NewRoomPage,
})

function NewRoomPage() {
  const navigate = useNavigate()
  const createRoom = useCreateRoom()
  const { addToast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      name: '',
      address: '',
      description: '',
      type: 'rent' as const,
      is_available: true,
      bedrooms: 0,
      bathrooms: 0,
      price: 0,
      area: 0,
    },
  })

  const onSubmit = async (data: unknown) => {
    try {
      await createRoom.mutateAsync(data as RoomForm)
      addToast('Room created', 'success')
      navigate({ to: '/admin/rooms' })
    } catch {
      addToast('Failed to create room', 'error')
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create Room</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Name</label>
              <Input error={errors.name?.message} {...register('name')} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Address</label>
              <Input error={errors.address?.message} {...register('address')} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Description</label>
              <textarea
                className="flex min-h-[100px] w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                {...register('description')}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Bedrooms</label>
                <Input type="number" error={errors.bedrooms?.message} {...register('bedrooms')} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Bathrooms</label>
                <Input type="number" error={errors.bathrooms?.message} {...register('bathrooms')} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Price</label>
                <Input type="number" error={errors.price?.message} {...register('price')} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Area (sqft)</label>
                <Input type="number" error={errors.area?.message} {...register('area')} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Type</label>
                <Select error={errors.type?.message} {...register('type')}>
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                </Select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...register('is_available')} className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500" />
                  <span className="text-sm font-medium text-stone-700">Available</span>
                </label>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Room'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate({ to: '/admin/rooms' })}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
