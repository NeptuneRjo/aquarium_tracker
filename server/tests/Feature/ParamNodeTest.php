<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Param;
use App\Models\Tank;
use App\Models\ParamNodes;
use Illuminate\Testing\Fluent\AssertableJson;

class ParamNodeTest extends TestCase
{
    use RefreshDatabase;

    private $clerk_headers = ['Clerk-Id' => 'user_1234abcd'];

    public function test_can_store_param_node()
    {
        $tank = Tank::factory()->create();
        $param = Param::factory()->create(["tank_id" => $tank->id]);

        $response = $this
            ->withHeaders($this->clerk_headers)
            ->postJson('/api/nodes', [
                'value' => 7.3,
                'param_ulid' => $param->param_ulid
            ]);

        $response
            ->assertStatus(200)
            ->assertJson(function (AssertableJson $json) {
                $json
                    ->has('name')
                    ->has('unit')
                    ->has('ulid')
                    ->has('values', 1)
                    ->has('latest_value')
                    ->where('latest_value', 7.3)
                    ->etc();
            });
    }

    public function test_can_update_param_node()
    {
        $tank = Tank::factory()->create();
        $param = Param::factory()->create(["tank_id" => $tank->id]);
        $param_node = ParamNodes::factory()->create(['param_id' => $param->id]);

        $response = $this
            ->withHeaders($this->clerk_headers)
            ->patchJson('/api/nodes/' . $param_node->param_node_ulid, ["value" => 1.5]);

        $response
            ->assertStatus(200)
            ->assertJson(function (AssertableJson $json) {
                $json
                    ->has('name')
                    ->has('unit')
                    ->has('ulid')
                    ->has('values', 1)
                    ->has('latest_value')
                    ->where('latest_value', 1.5)
                    ->etc();
            });
    }

    public function test_can_delete_param_node()
    {
        $tank = Tank::factory()->create();
        $param = Param::factory()->create(["tank_id" => $tank->id]);
        $param_node = ParamNodes::factory()->create(['param_id' => $param->id]);

        $response = $this
            ->withHeaders($this->clerk_headers)
            ->delete('/api/nodes/' . $param_node->param_node_ulid);

        $response
            ->assertStatus(200);
    }
}
