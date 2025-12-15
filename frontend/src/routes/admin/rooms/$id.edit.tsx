import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select } from '@/components/ui';
import { roomFormSchema, type RoomForm } from '@/dto';
import { useAdminRoom, useToast, useUpdateRoom, useUploadImages } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export const Route = createFileRoute('/admin/rooms/$id/edit')({
   component: EditRoomPage,
});

function EditRoomPage() {
   const { id } = Route.useParams();
   const roomId = Number(id);
   const navigate = useNavigate();
   const { data: room, isLoading } = useAdminRoom(roomId);
   const updateRoom = useUpdateRoom(roomId);
   const uploadImages = useUploadImages(roomId);
   const { addToast } = useToast();
   const [files, setFiles] = useState<File[]>([]);

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting },
   } = useForm({
      resolver: zodResolver(roomFormSchema),
   });

   useEffect(() => {
      if (room) {
         reset({
            name: room.name,
            address: room.address,
            description: room.description ?? '',
            bedrooms: room.bedrooms,
            bathrooms: room.bathrooms,
            price: room.price,
            area: room.area,
            type: room.type,
            is_available: room.is_available,
         });
      }
   }, [room, reset]);

   const onSubmit = async (data: unknown) => {
      try {
         await updateRoom.mutateAsync(data as RoomForm);
         if (files.length > 0) {
            await uploadImages.mutateAsync(files);
         }
         addToast('Room updated', 'success');
         navigate({ to: '/admin/rooms' });
      } catch {
         addToast('Failed to update room', 'error');
      }
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
         setFiles(Array.from(e.target.files));
      }
   };

   if (isLoading) {
      return <div className="text-stone-500">Loading...</div>;
   }

   if (!room) {
      return <div className="text-stone-500">Room not found</div>;
   }

   return (
      <div className="mx-auto max-w-2xl">
         <Card>
            <CardHeader>
               <CardTitle>Edit Room</CardTitle>
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
                        className="flex min-h-25 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
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
                           <input
                              type="checkbox"
                              {...register('is_available')}
                              className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                           />
                           <span className="text-sm font-medium text-stone-700">Available</span>
                        </label>
                     </div>
                  </div>

                  {room.media && room.media.length > 0 && (
                     <div>
                        <label className="mb-2 block text-sm font-medium text-stone-700">Current Images</label>
                        <div className="grid grid-cols-4 gap-2">
                           {room.media.map(media => (
                              <div key={media.id} className="relative aspect-video overflow-hidden rounded-md bg-stone-100">
                                 <img src={media.original_url} alt="" className="h-full w-full object-cover" />
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  <div>
                     <label className="mb-2 block text-sm font-medium text-stone-700">Upload New Images</label>
                     <div className="flex items-center gap-4">
                        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-stone-300 px-4 py-2 text-sm text-stone-600 hover:bg-stone-50">
                           <Upload className="h-4 w-4" />
                           Choose files
                           <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                        {files.length > 0 && (
                           <div className="flex items-center gap-2">
                              <span className="text-sm text-stone-600">{files.length} file(s) selected</span>
                              <button type="button" onClick={() => setFiles([])} className="text-stone-400 hover:text-stone-600">
                                 <X className="h-4 w-4" />
                              </button>
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                     <Button type="submit" disabled={isSubmitting || uploadImages.isPending}>
                        {isSubmitting || uploadImages.isPending ? 'Saving...' : 'Save Changes'}
                     </Button>
                     <Button type="button" variant="outline" onClick={() => navigate({ to: '/admin/rooms' })}>
                        Cancel
                     </Button>
                  </div>
               </form>
            </CardContent>
         </Card>
      </div>
   );
}
