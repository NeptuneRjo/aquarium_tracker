<?php

namespace Database\Factories;

use App\Models\Param;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class ParamNodesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "param_value" => 1.2,
            "param_id" => Param::inRandomOrder()->first()->id,
        ];
    }
}
