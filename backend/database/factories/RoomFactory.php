<?php

namespace Database\Factories;

use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoomFactory extends Factory
{
    protected $model = Room::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->words(3, true),
            'address' => fake()->address(),
            'description' => fake()->paragraph(),
            'bedrooms' => fake()->numberBetween(1, 5),
            'bathrooms' => fake()->numberBetween(1, 3),
            'price' => fake()->randomFloat(2, 1000, 50000),
            'area' => fake()->randomFloat(2, 20, 200),
            'type' => fake()->randomElement(['rent', 'sale']),
            'is_available' => true,
        ];
    }

    public function unavailable(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_available' => false,
        ]);
    }

    public function forRent(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'rent',
        ]);
    }

    public function forSale(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'sale',
        ]);
    }
}
