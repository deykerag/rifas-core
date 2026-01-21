<?php

namespace Database\Seeders;

use App\Enums\RoleEnum;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the user roles seeds.
     */
    public function run(): void
    {
        Role::create([
            'name' => RoleEnum::SUPER_ADMIN->value,
            'guard_name' => 'web'
        ]);

        Role::create([
            'name' => RoleEnum::ADMIN->value,
            'guard_name' => 'web'
        ]);

        Role::create([
            'name' => RoleEnum::VERIFICATOR->value,
            'guard_name' => 'web'
        ]);
    }
}
