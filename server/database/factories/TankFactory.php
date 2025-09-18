<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tank>
 */
class TankFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "tank_name" => fake()->company(),
            "tank_description" => fake()->sentence(12),
            "clerk_id" => "user_32Z7QStsrO2xyPH5to0UabJ1iXg",
        ];
    }
}
