<?php
namespace Tests\Feature\Api;

use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;
use Tests\TestCase;

class RoomControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $adminUser;

    private User $buyerUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->adminUser = User::factory()->create(['role' => 'admin']);
        $this->buyerUser = User::factory()->create(['role' => 'user']);
    }

    // ==================== INDEX TESTS ====================

    public function test_authenticated_user_can_get_rooms_list(): void
    {
        Room::factory()->count(5)->create();

        Passport::actingAs($this->buyerUser);

        $response = $this->getJson('/api/room');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'address',
                        'description',
                        'bedrooms',
                        'bathrooms',
                        'price',
                        'area',
                        'type',
                    ],
                ],
                'meta' => [
                    'total',
                    'per_page',
                    'current_page',
                    'last_page',
                ],
            ]);

        $this->assertCount(5, $response->json('data'));
    }

    public function test_unauthenticated_user_cannot_get_rooms_list(): void
    {
        $response = $this->getJson('/api/room');

        $response->assertStatus(401);
    }

    public function test_rooms_list_can_be_filtered_by_bedrooms(): void
    {
        Room::factory()->create(['bedrooms' => 2]);
        Room::factory()->create(['bedrooms' => 3]);
        Room::factory()->create(['bedrooms' => 2]);

        Passport::actingAs($this->buyerUser);

        $response = $this->getJson('/api/room?bedrooms=2');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    public function test_rooms_list_can_be_filtered_by_bathrooms(): void
    {
        Room::factory()->create(['bathrooms' => 1]);
        Room::factory()->create(['bathrooms' => 2]);
        Room::factory()->create(['bathrooms' => 1]);

        Passport::actingAs($this->buyerUser);

        $response = $this->getJson('/api/room?bathrooms=1');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    public function test_rooms_list_can_be_filtered_by_type(): void
    {
        Room::factory()->forRent()->count(2)->create();
        Room::factory()->forSale()->count(3)->create();

        Passport::actingAs($this->buyerUser);

        $response = $this->getJson('/api/room?type=rent');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    public function test_rooms_list_can_be_filtered_by_availability(): void
    {
        Room::factory()->count(3)->create(['is_available' => true]);
        Room::factory()->unavailable()->count(2)->create();

        Passport::actingAs($this->buyerUser);

        $response = $this->getJson('/api/room?is_available=1');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    public function test_rooms_list_can_be_searched_by_name(): void
    {
        Room::factory()->create(['name' => 'Luxury Condo']);
        Room::factory()->create(['name' => 'Budget Apartment']);
        Room::factory()->create(['name' => 'Luxury Suite']);

        Passport::actingAs($this->buyerUser);

        $response = $this->getJson('/api/room?search=Luxury');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    public function test_rooms_list_supports_pagination(): void
    {
        Room::factory()->count(20)->create();

        Passport::actingAs($this->buyerUser);

        $response = $this->getJson('/api/room?per_page=5');

        $response->assertStatus(200);
        $this->assertCount(5, $response->json('data'));
        $this->assertEquals(20, $response->json('meta.total'));
        $this->assertEquals(4, $response->json('meta.last_page'));
    }

    // ==================== SHOW TESTS ====================

    public function test_authenticated_user_can_get_single_room(): void
    {
        $room = Room::factory()->create([
            'name'        => 'Test Room',
            'address'     => '123 Test Street',
            'description' => 'A beautiful room',
            'bedrooms'    => 2,
            'bathrooms'   => 1,
            'price'       => 5000,
            'area'        => 100,
            'type'        => 'rent',
        ]);

        Passport::actingAs($this->buyerUser);

        $response = $this->getJson("/api/room/{$room->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id'          => $room->id,
                    'name'        => 'Test Room',
                    'address'     => '123 Test Street',
                    'description' => 'A beautiful room',
                    'bedrooms'    => 2,
                    'bathrooms'   => 1,
                    'type'        => 'rent',
                ],
            ]);
    }

    public function test_unauthenticated_user_cannot_get_single_room(): void
    {
        $room = Room::factory()->create();

        $response = $this->getJson("/api/room/{$room->id}");

        $response->assertStatus(401);
    }

    public function test_get_room_returns_404_for_non_existent_room(): void
    {
        Passport::actingAs($this->buyerUser);

        $response = $this->getJson('/api/room/99999');

        $response->assertStatus(404);
    }

    // ==================== STORE TESTS ====================

    public function test_admin_can_create_room(): void
    {
        Passport::actingAs($this->adminUser);

        $roomData = [
            'name'         => 'New Room',
            'address'      => '456 New Street',
            'description'  => 'A brand new room',
            'bedrooms'     => 3,
            'bathrooms'    => 2,
            'price'        => 10000,
            'area'         => 150,
            'type'         => 'sale',
            'is_available' => true,
        ];

        $response = $this->postJson('/api/room', $roomData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'id',
                    'name',
                    'address',
                    'description',
                    'bedrooms',
                    'bathrooms',
                    'price',
                    'area',
                    'type',
                    'is_available',
                ],
            ])
            ->assertJson([
                'message' => 'Room created successfully',
                'data' => [
                    'name'        => 'New Room',
                    'address'     => '456 New Street',
                    'description' => 'A brand new room',
                    'bedrooms'    => 3,
                    'bathrooms'   => 2,
                    'type'        => 'sale',
                ],
            ]);

        $this->assertDatabaseHas('rooms', [
            'name'    => 'New Room',
            'address' => '456 New Street',
        ]);
    }

    public function test_buyer_cannot_create_room(): void
    {
        Passport::actingAs($this->buyerUser);

        $roomData = [
            'name'      => 'New Room',
            'address'   => '456 New Street',
            'bedrooms'  => 3,
            'bathrooms' => 2,
            'price'     => 10000,
            'area'      => 150,
            'type'      => 'sale',
        ];

        $response = $this->postJson('/api/room', $roomData);

        $response->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_create_room(): void
    {
        $roomData = [
            'name'      => 'New Room',
            'address'   => '456 New Street',
            'bedrooms'  => 3,
            'bathrooms' => 2,
            'price'     => 10000,
            'area'      => 150,
            'type'      => 'sale',
        ];

        $response = $this->postJson('/api/room', $roomData);

        $response->assertStatus(401);
    }

    public function test_create_room_fails_without_required_fields(): void
    {
        Passport::actingAs($this->adminUser);

        $response = $this->postJson('/api/room', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'name',
                'address',
                'bedrooms',
                'bathrooms',
                'price',
                'area',
                'type',
            ]);
    }

    public function test_create_room_fails_with_duplicate_name(): void
    {
        Room::factory()->create(['name' => 'Existing Room']);

        Passport::actingAs($this->adminUser);

        $roomData = [
            'name'      => 'Existing Room',
            'address'   => '456 New Street',
            'bedrooms'  => 3,
            'bathrooms' => 2,
            'price'     => 10000,
            'area'      => 150,
            'type'      => 'sale',
        ];

        $response = $this->postJson('/api/room', $roomData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    // ==================== UPDATE TESTS ====================

    public function test_admin_can_update_room(): void
    {
        $room = Room::factory()->create([
            'name'    => 'Old Name',
            'address' => 'Old Address',
        ]);

        Passport::actingAs($this->adminUser);

        $updateData = [
            'name'        => 'Updated Name',
            'address'     => 'Updated Address',
            'description' => 'Updated description',
            'bedrooms'    => 4,
            'bathrooms'   => 3,
            'price'       => 20000,
            'area'        => 200,
            'type'        => 'rent',
        ];

        $response = $this->putJson("/api/room/{$room->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id'          => $room->id,
                    'name'        => 'Updated Name',
                    'address'     => 'Updated Address',
                    'description' => 'Updated description',
                    'bedrooms'    => 4,
                    'bathrooms'   => 3,
                    'type'        => 'rent',
                ],
            ]);

        $this->assertDatabaseHas('rooms', [
            'id'      => $room->id,
            'name'    => 'Updated Name',
            'address' => 'Updated Address',
        ]);
    }

    public function test_admin_can_update_room_with_same_name(): void
    {
        $room = Room::factory()->create(['name' => 'My Room']);

        Passport::actingAs($this->adminUser);

        $updateData = [
            'name'      => 'My Room',
            'address'   => 'New Address',
            'bedrooms'  => 4,
            'bathrooms' => 3,
            'price'     => 20000,
            'area'      => 200,
            'type'      => 'rent',
        ];

        $response = $this->putJson("/api/room/{$room->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'name'    => 'My Room',
                    'address' => 'New Address',
                ],
            ]);
    }

    public function test_update_room_fails_with_duplicate_name(): void
    {
        Room::factory()->create(['name' => 'Existing Room']);
        $room = Room::factory()->create(['name' => 'My Room']);

        Passport::actingAs($this->adminUser);

        $updateData = [
            'name'      => 'Existing Room',
            'address'   => 'Some Address',
            'bedrooms'  => 4,
            'bathrooms' => 3,
            'price'     => 20000,
            'area'      => 200,
            'type'      => 'rent',
        ];

        $response = $this->putJson("/api/room/{$room->id}", $updateData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_buyer_cannot_update_room(): void
    {
        $room = Room::factory()->create();

        Passport::actingAs($this->buyerUser);

        $updateData = [
            'name'      => 'Updated Name',
            'address'   => 'Updated Address',
            'bedrooms'  => 4,
            'bathrooms' => 3,
            'price'     => 20000,
            'area'      => 200,
            'type'      => 'rent',
        ];

        $response = $this->putJson("/api/room/{$room->id}", $updateData);

        $response->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_update_room(): void
    {
        $room = Room::factory()->create();

        $updateData = [
            'name'      => 'Updated Name',
            'address'   => 'Updated Address',
            'bedrooms'  => 4,
            'bathrooms' => 3,
            'price'     => 20000,
            'area'      => 200,
            'type'      => 'rent',
        ];

        $response = $this->putJson("/api/room/{$room->id}", $updateData);

        $response->assertStatus(401);
    }

    public function test_update_room_returns_404_for_non_existent_room(): void
    {
        Passport::actingAs($this->adminUser);

        $updateData = [
            'name'      => 'Updated Name',
            'address'   => 'Updated Address',
            'bedrooms'  => 4,
            'bathrooms' => 3,
            'price'     => 20000,
            'area'      => 200,
            'type'      => 'rent',
        ];

        $response = $this->putJson('/api/room/99999', $updateData);

        $response->assertStatus(404);
    }

    public function test_admin_can_update_room_availability(): void
    {
        $room = Room::factory()->create(['is_available' => true]);

        Passport::actingAs($this->adminUser);

        $updateData = [
            'name'         => $room->name,
            'address'      => $room->address,
            'bedrooms'     => $room->bedrooms,
            'bathrooms'    => $room->bathrooms,
            'price'        => $room->price,
            'area'         => $room->area,
            'type'         => $room->type,
            'is_available' => false,
        ];

        $response = $this->putJson("/api/room/{$room->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'is_available' => false,
                ],
            ]);

        $this->assertDatabaseHas('rooms', [
            'id'           => $room->id,
            'is_available' => false,
        ]);
    }

    // ==================== DELETE TESTS ====================

    public function test_admin_can_delete_room(): void
    {
        $room = Room::factory()->create();

        Passport::actingAs($this->adminUser);

        $response = $this->deleteJson("/api/room/{$room->id}");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Room deleted successfully',
            ]);

        $this->assertSoftDeleted('rooms', ['id' => $room->id]);
    }

    public function test_buyer_cannot_delete_room(): void
    {
        $room = Room::factory()->create();

        Passport::actingAs($this->buyerUser);

        $response = $this->deleteJson("/api/room/{$room->id}");

        $response->assertStatus(403);

        $this->assertDatabaseHas('rooms', [
            'id'         => $room->id,
            'deleted_at' => null,
        ]);
    }

    public function test_unauthenticated_user_cannot_delete_room(): void
    {
        $room = Room::factory()->create();

        $response = $this->deleteJson("/api/room/{$room->id}");

        $response->assertStatus(401);
    }

    public function test_delete_room_returns_404_for_non_existent_room(): void
    {
        Passport::actingAs($this->adminUser);

        $response = $this->deleteJson('/api/room/99999');

        $response->assertStatus(404);
    }
}
