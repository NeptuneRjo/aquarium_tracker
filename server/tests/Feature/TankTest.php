<?php

namespace Tests\Feature;

use App\Models\Tank;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Testing\Fluent\AssertableJson;

class TankTest extends TestCase
{
    use RefreshDatabase;

    private $clerk_headers = ['Clerk-Id' => 'user_1234abcd'];

    /**
     * A basic feature test example.
     */
    public function test_can_get_all_tanks(): void
    {
        $this->seed();

        $response = $this
            ->withHeaders($this->clerk_headers)
            ->get('/api/tanks');

        $response
            ->assertStatus(200)
            ->assertJson(function (AssertableJson $json) {
                $json->has(0, function (AssertableJson $json) {
                    $json
                        ->where('name', 'tank one')
                        ->where('description', 'tank description paragraph')
                        ->etc();
                });
            });
    }

    public function test_can_get_one_tank(): void
    {
        $tank = Tank::factory()->create();

        $response = $this
            ->withHeaders($this->clerk_headers)
            ->get('/api/tanks/' . $tank->tank_ulid);

        $response
            ->assertStatus(200)
            ->assertJson(function (AssertableJson $json) {
                $json
                    ->has('name')
                    ->has('description')
                    ->has('ulid')
                    ->has('params')
                    ->etc();
            });
    }

    public function test_error_when_no_tank_found(): void
    {
        $response = $this
            ->withHeaders($this->clerk_headers)
            ->get('/api/tanks/' . 'fake-ulid');

        $response
            ->assertStatus(404);
    }

    public function test_can_create_new_tank(): void
    {
        $response = $this
            ->withHeaders($this->clerk_headers)
            ->postJson('/api/tanks', [
                "name" => "test tank",
                "description" => "test description"
            ]);

        $response
            ->assertStatus(200)
            ->assertJson(function (AssertableJson $json) {
                $json
                    ->where('name', 'test tank')
                    ->where('description', 'test description')
                    ->has('ulid')
                    ->has('params', 8)
                    ->etc();
            });
    }

    public function test_error_when_invalid_post_values(): void
    {
        $response = $this
            ->withHeaders($this->clerk_headers)
            ->postJson('/api/tanks', [
                "wrong value" => "test tank",
                "not a description" => "test description"
            ]);

        $response
            ->assertStatus(400);
    }

    public function test_can_update_tank(): void
    {
        $tank = Tank::factory()->create();

        $response = $this
            ->withHeaders($this->clerk_headers)
            ->patchJson('/api/tanks/' . $tank->tank_ulid, [
                'name' => 'new name',
                'description' => ''
            ]);

        $response
            ->assertStatus(200)
            ->assertJson(function (AssertableJson $json) {
                $json
                    ->has('name')
                    ->has('description')
                    ->has('ulid')
                    ->has('params')
                    ->where('name', 'new name')
                    ->where('description', '')
                    ->etc();
            });
    }

    public function test_error_when_invalid_update_values()
    {
        $tank = Tank::factory()->create();

        $response = $this
            ->withHeaders($this->clerk_headers)
            ->patchJson('/api/tanks/' . $tank->tank_ulid, [
                'name' => '',
            ]);

        $response
            ->assertStatus(400);
    }

    public function test_can_delete_tank()
    {
        $tank = Tank::factory()->create();

        $response = $this
            ->withHeaders($this->clerk_headers)
            ->delete('/api/tanks/' . $tank->tank_ulid);

        $response
            ->assertStatus(200);
    }
}
