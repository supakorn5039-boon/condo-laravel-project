<?php
namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        User::create([
            'first_name' => 'John',
            'last_name'  => 'Doe',
            'email'      => 'admin@example.com',
            'password'   => 'password',
            'role'       => 'admin',
            'phone'      => '1234567890',
        ]);

        // Regular user
        User::create([
            'first_name' => 'Jane',
            'last_name'  => 'Smith',
            'email'      => 'gbailey@example.net',
            'password'   => '+-0pBNvYgxwmi/#iw',
            'role'       => 'user',
            'phone'      => '9876543210',
        ]);

        // Create 5 more random users using factory
        User::factory()->count(5)->create();
    }
}
