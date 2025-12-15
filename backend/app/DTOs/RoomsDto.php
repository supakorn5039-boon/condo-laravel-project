<?php
namespace App\DTOs;

readonly class RoomsDto
{
    public function __construct(
        public string $address,
        public string $name,
        public float $area,
        public float $price,
        public ?string $type,
        public ?string $description = null,
        public int $bedrooms = 0,
        public int $bathrooms = 0,
        public int $is_available = 1
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            address: $data['address'],
            name: $data['name'],
            area: $data['area'],
            price: $data['price'],
            type: $data['type'],
            description: $data['description'] ?? null,
            bedrooms: $data['bedrooms'] ?? 0,
            bathrooms: $data['bathrooms'] ?? 0,
            is_available: $data['is_available'] ?? false
        );
    }
}
