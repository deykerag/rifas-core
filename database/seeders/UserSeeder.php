<?php

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@app.com',
            'password' => bcrypt('12345678'),
        ]);

        $superAdmin->assignRole(RoleEnum::SUPER_ADMIN->value);

        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@app.com',
            'password' => bcrypt('12345678'),
        ]);

        $admin->assignRole(RoleEnum::ADMIN->value);

        $verificator = User::create([
            'name' => 'User Verificator',
            'email' => 'verificator@app.com',
            'password' => bcrypt('12345678'),
        ]);

        $verificator->assignRole(RoleEnum::VERIFICATOR->value);
    }
}
