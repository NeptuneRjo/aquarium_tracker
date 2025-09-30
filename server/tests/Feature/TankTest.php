<?php

namespace Tests\Feature;

use App\Models\Param;
use App\Models\Tank;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Testing\Fluent\AssertableJson;

class TankTest extends TestCase
{
    use RefreshDatabase;

    private $clerk_headers = ['Clerk-Id' => 'user_32Z7QStsrO2xyPH5to0UabJ1iXg'];

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
                $json
                    ->where('status', 200)
                    ->has('message')
                    ->has('data', function (AssertableJson $json) {
                        $json->has(0, function (AssertableJson $json) {
                            $json
                                ->has('name')
                                ->has('description')
                                ->etc();
                        });
                    })
                    ->etc();
            });
    }

    public function test_can_get_one_tank(): void
    {
        $tank = Tank::factory()->create();
        $param = Param::factory()->create(["tank_id" => $tank->id]);

        $response = $this
            ->withHeaders($this->clerk_headers)
            ->get('/api/tanks/' . $tank->tank_ulid);

        $response
            ->assertStatus(200)
            ->assertJson(function (AssertableJson $json) {
                $json
                    ->where('status', 200)
                    ->has('message')
                    ->has('data', function (AssertableJson $json) {
                        $json
                            ->has('name')
                            ->has('description')
                            ->has('ulid')
                            ->has('params', function (AssertableJson $json) {
                                $json
                                    ->has(0, function (AssertableJson $json) {
                                        $json
                                            ->has('name')
                                            ->has('unit')
                                            ->etc();
                                    });
                            })
                            ->etc();
                    });
            });
    }

    public function test_error_when_no_tank_found(): void
    {
        $response = $this
            ->withHeaders($this->clerk_headers)
            ->get('/api/tanks/' . 'fake-ulid');

        $response
            ->assertStatus(404)
            ->assertJson(function (AssertableJson $json) {
                $json
                    ->where('status', 404)
                    ->where('data', [])
                    ->where('message', "No tank found with that ULID.")
                    ->etc();
            });
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
                    ->where('status', 200)
                    ->has('message')
                    ->has('data', function (AssertableJson $json) {
                        $json
                            ->where('name', 'test tank')
                            ->where('description', 'test description')
                            ->has('ulid')
                            ->has('params', 8)
                            ->etc();
                    });
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
            ->assertStatus(400)
            ->assertJson(function (AssertableJson $json) {
                $json
                    ->where('status', 400)
                    ->where('data', [])
                    ->has('message');
            });
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
                    ->where('status', 200)
                    ->has('message')
                    ->has('data', function (AssertableJson $json) {
                        $json
                            ->has('name')
                            ->has('description')
                            ->has('ulid')
                            ->has('params')
                            ->where('name', 'new name')
                            ->where('description', '')
                            ->etc();
                    });
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
            ->assertStatus(400)
            ->assertJson(function (AssertableJson $json) {
                $json
                    ->where('status', 400)
                    ->where('data', [])
                    ->has('message');
            });
    }

    public function test_can_delete_tank()
    {
        $tank = Tank::factory()->create();
        $success_message = 'Tank ' . $tank->tank_ulid . ' successfully deleted.';

        $response = $this
            ->withHeaders($this->clerk_headers)
            ->delete('/api/tanks/' . $tank->tank_ulid);

        $response
            ->assertStatus(200)
            ->assertJson(function (AssertableJson $json) use ($success_message) {
                $json
                    ->where('status', 200)
                    ->where('data', [])
                    ->where('message', $success_message)
                    ->etc();
            });
    }
}
