<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'name' => 'Joseline International',
                'email' => 'joseline@admin.com',
                'email_verified_at' => null,
                'password' => '$2y$12$gP5nvJ4AIC/VDQB9rOQjS.QaLPo.JO31ZTF6o1HwBrn...',
                'role' => 'agency',
                'remember_token' => Str::random(10),
                'created_at' => '2026-02-28 22:47:44',
                'updated_at' => '2026-02-28 22:47:44',
                'status' => 'Active',
            ],
        ]);
    }
}
