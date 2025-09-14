<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Tank;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Param>
 */
class ParamFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "param_name" => fake()->name(),
            "param_unit" => "PPM",
            "tank_id" => Tank::inRandomOrder()->first()->id,
            "clerk_id" => "user_32Z7QStsrO2xyPH5to0UabJ1iXg",
        ];
    }
}
