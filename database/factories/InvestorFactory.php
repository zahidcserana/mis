<?php

namespace Database\Factories;

use App\Models\Investor;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Investor>
 */
class InvestorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'uid' => 'INV-' . fake()->unique()->numberBetween(100000, 999999),
            'name' => fake()->name(),
            'nickname' => fake()->optional()->firstName(),
            'email' => fake()->unique()->safeEmail(),
            'permanent_address' => fake()->address(),
            'current_address' => fake()->address(),
            'personal_info' => [
                'date_of_birth' => fake()->date('Y-m-d', '2000-01-01'),
                'nationality' => fake()->country(),
                'occupation' => fake()->jobTitle(),
                'income_range' => fake()->randomElement(['50k-100k', '100k-200k', '200k-500k', '500k+']),
            ],
            'mobile' => fake()->phoneNumber(),
            'emergency_mobile' => fake()->optional()->phoneNumber(),
            'status' => fake()->randomElement(Investor::getStatuses()),
        ];
    }

    /**
     * Indicate that the investor is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Investor::STATUS_ACTIVE,
        ]);
    }

    /**
     * Indicate that the investor is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Investor::STATUS_PENDING,
        ]);
    }

    /**
     * Indicate that the investor belongs to an existing user.
     */
    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }
}