<?php
namespace App\Services;

use App\DTOs\RoomsDto;
use App\Models\Room;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class RoomService
{
    protected function RoomsFilter(Builder $query, array $filters): void
    {
        if (isset($filters['bedrooms'])) {
            $query->where('bedrooms', $filters['bedrooms']);
        }

        if (isset($filters['bathrooms'])) {
            $query->where('bathrooms', $filters['bathrooms']);
        }

        if (isset($filters['price'])) {
            $query->where('price', $filters['price']);
        }

        if (isset($filters['area'])) {
            $query->where('area', $filters['area']);
        }

        if (isset($filters['search'])) {
            $search = strtolower($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', ['%' . $search . '%'])
                    ->orWhereRaw('LOWER(description) LIKE ?', ['%' . $search . '%']);
            });
        }

        if (isset($filters['type']) && $filters['type'] !== '') {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['is_available']) && $filters['is_available'] !== '') {
            $query->where('is_available', (int) $filters['is_available']);
        }
    }

    public function getRooms(array $filters = [], int $perPage = 15, bool $isAdmin = false): LengthAwarePaginator
    {
        $query = Room::query()->with('media');

        if ($isAdmin) {
            $query->select([
                'id', 'name', 'address', 'description', 'bedrooms', 'bathrooms',
                'price', 'area', 'type', 'is_available', 'created_at', 'updated_at',
            ]);
        } else {
            $query->select([
                'id', 'name', 'address', 'description', 'bedrooms', 'bathrooms',
                'price', 'area', 'type',
            ]);

            $query->where('is_available', true);
        }

        $this->RoomsFilter($query, $filters);

        return $query->paginate($perPage);
    }

    public function getRoomById(int $id): Room
    {
        return Room::with('media')->findOrFail($id);
    }

    public function createRoom(RoomsDto $dto, ?array $images = null, ?int $ownerId = null): Room
    {
        $room = Room::create([
            'name'         => $dto->name,
            'address'      => $dto->address,
            'description'  => $dto->description ?? '',
            'bedrooms'     => $dto->bedrooms,
            'bathrooms'    => $dto->bathrooms,
            'price'        => $dto->price,
            'area'         => $dto->area,
            'type'         => $dto->type,
            'is_available' => $dto->is_available ?? true,
            'owner_id'     => $ownerId,
        ]);

        if ($images) {
            foreach ($images as $image) {
                $room->addMedia($image)
                    ->toMediaCollection('images');
            }
        }

        return $room->fresh()->load('media');
    }

    public function updateRoom(int $id, RoomsDto $dto): Room
    {
        $room = Room::findOrFail($id);

        $room->update([
            'name'         => $dto->name,
            'address'      => $dto->address,
            'description'  => $dto->description ?? '',
            'bedrooms'     => $dto->bedrooms,
            'bathrooms'    => $dto->bathrooms,
            'price'        => $dto->price,
            'area'         => $dto->area,
            'type'         => $dto->type,
            'is_available' => $dto->is_available,
        ]);

        return $room->fresh();
    }

    public function deleteRoom(int $id): bool
    {
        $room = Room::findOrFail($id);

        return $room->delete();
    }

    public function uploadImages(int $id, array $images): Room
    {
        $room = Room::findOrFail($id);

        foreach ($images as $image) {
            $room->addMedia($image)
                ->toMediaCollection('images');
        }

        return $room->load('media');
    }

    public function deleteImage(int $roomId, int $mediaId): bool
    {
        $room  = Room::findOrFail($roomId);
        $media = $room->media()->findOrFail($mediaId);

        return $media->delete();
    }
}
