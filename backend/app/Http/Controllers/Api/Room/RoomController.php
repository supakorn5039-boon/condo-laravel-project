<?php

namespace App\Http\Controllers\Api\Room;

use App\DTOs\RoomsDto;
use App\Http\Controllers\Controller;
use App\Http\Middleware\RoleMiddleware;
use App\Http\Requests\RoomRequest;
use App\Services\RoomService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class RoomController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware(RoleMiddleware::using('admin'), only: ['store', 'update', 'destroy', 'uploadImages', 'deleteImage']),
        ];
    }

    public function __construct(
        private RoomService $roomService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $isAdmin = $user?->hasRole('admin') ?? false;

        $rooms = $this->roomService->getRooms(
            $request->only(['bedrooms', 'bathrooms', 'price', 'area', 'search', 'type', 'is_available']),
            $request->input('per_page', 15),
            $isAdmin
        );

        return response()->json([
            'data' => $rooms->items(),
            'meta' => [
                'total' => $rooms->total(),
                'per_page' => $rooms->perPage(),
                'current_page' => $rooms->currentPage(),
                'last_page' => $rooms->lastPage(),
                'from' => $rooms->firstItem(),
                'to' => $rooms->lastItem(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json([
            'data' => $this->roomService->getRoomById($id),
        ]);
    }

    public function store(RoomRequest $request): JsonResponse
    {
        $dto = RoomsDto::fromArray($request->validated());
        $room = $this->roomService->createRoom(
            $dto,
            $request->file('images'),
            $request->user()->id
        );

        return response()->json([
            'message' => 'Room created successfully',
            'data' => $room,
        ], 201);
    }

    public function update(RoomRequest $request, int $id): JsonResponse
    {
        $dto = RoomsDto::fromArray($request->validated());
        $room = $this->roomService->updateRoom($id, $dto);

        return response()->json([
            'message' => 'Room updated successfully',
            'data' => $room,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->roomService->deleteRoom($id);

        return response()->json([
            'message' => 'Room deleted successfully',
        ]);
    }

    public function uploadImages(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'images' => ['required', 'array'],
            'images.*' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
        ]);

        $room = $this->roomService->uploadImages($id, $request->file('images'));

        return response()->json([
            'message' => 'Images uploaded successfully',
            'data' => [
                'room' => $room,
                'images' => $room->getMedia('images')->map(fn ($media) => [
                    'id' => $media->id,
                    'url' => $media->getUrl(),
                    'preview' => $media->getUrl('preview'),
                ]),
            ],
        ]);
    }

    public function deleteImage(int $roomId, int $mediaId): JsonResponse
    {
        $this->roomService->deleteImage($roomId, $mediaId);

        return response()->json([
            'message' => 'Image deleted successfully',
        ]);
    }
}
