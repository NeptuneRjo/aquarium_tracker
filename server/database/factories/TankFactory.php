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
            "tank_name" => fake()->name(),
            "tank_description" => fake()->realText(64),
            "clerk_id" => "user_" . fake()->numberBetween(1000, 9999) . 'abcd',
        ];
    }
}
