<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@aurahealth.clinic'],
            [
                'name' => 'Admin Aura',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'staff@aurahealth.clinic'],
            [
                'name' => 'Staff Aura',
                'password' => Hash::make('staff123'),
                'role' => 'staff',
            ]
        );
    }
}
