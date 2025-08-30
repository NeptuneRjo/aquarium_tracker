<?php

namespace Tests\Feature;

use App\Models\Param;
use App\Models\Tank;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class ParamTest extends TestCase
{
    use RefreshDatabase;

    private $clerk_headers = ['Clerk-Id' => 'user_1234abcd'];

    public function test_can_get_one_param()
    {
        $tank = Tank::factory()->create();
        $param = Param::factory()->create(["tank_id" => $tank->id]);

        $response = $this
            ->withHeaders($this->clerk_headers)
            ->get('/api/params/' . $param->param_ulid);

        $response
            ->assertStatus(200)
            ->assertJson(function (AssertableJson $json) {
                $json
                    ->has('name')
                    ->has('unit')
                    ->has('ulid')
                    ->has('values')
                    ->etc();
            });
    }

    public function test_can_create_new_param()
    {
        $tank = Tank::factory()->create();

        $response = $this
            ->withHeaders($this->clerk_headers)
            ->postJson('/api/params', [
                'name' => 'Test param',
                'unit' => 'dKh',
                'tank_ulid' => $tank->tank_ulid
            ]);

        $response
            ->assertStatus(200)
            ->assertJson(function (AssertableJson $json) {
                $json
                    ->where('name', 'Test param')
                    ->where('unit', 'dKh')
                    ->has('ulid')
                    ->has('values')
                    ->etc();
            });
    }

    public function test_error_when_no_parent_found_on_create()
    {
        $response = $this
            ->withHeaders($this->clerk_headers)
            ->postJson('/api/params', [
                'name' => 'Test param',
                'unit' => 'dKh',
                'tank_ulid' => 'fake ulid'
            ]);

        $response
            ->assertStatus(404);
    }

    public function test_can_update_param()
    {
        $tank = Tank::factory()->create();
        $param = Param::factory()->create(["tank_id" => $tank->id]);

        $response = $this
            ->withHeaders($this->clerk_headers)
            ->patchJson('/api/params/' . $param->param_ulid, [
                'name' => 'new name',
                'unit' => 'PPM'
            ]);

        $response
            ->assertStatus(200)
            ->assertJson(function (AssertableJson $json) {
                $json
                    ->has('name')
                    ->has('unit')
                    ->has('ulid')
                    ->has('values')
                    ->where('name', 'new name')
                    ->where('unit', 'PPM')
                    ->etc();
            });
    }

    public function test_update_fails_if_invalid_data()
    {
        $tank = Tank::factory()->create();
        $param = Param::factory()->create(["tank_id" => $tank->id]);

        $response = $this
            ->withHeaders($this->clerk_headers)
            ->patchJson('/api/params/' . $param->param_ulid, [
                'name' => '',
                'unit' => ''
            ]);

        $response
            ->assertStatus(400);
    }

    public function test_can_delete_param()
    {
        $tank = Tank::factory()->create();
        $param = Param::factory()->create(['tank_id' => $tank->id]);

        $response = $this
            ->withHeaders($this->clerk_headers)
            ->delete('/api/params/' . $param->param_ulid);

        $response
            ->assertStatus(200);
    }
}
