<?php

namespace Database\Seeders;

use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();

        Room::create([
            'name' => 'Room 1',
            'owner_id' => $admin?->id,
            'address' => 'Address 1',
            'description' => 'Description 1',
            'bedrooms' => 1,
            'bathrooms' => 1,
            'price' => 100,
            'area' => 100,
            'type' => 'rent',
            'is_available' => true,
        ]);
    }
}
