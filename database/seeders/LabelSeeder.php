<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LabelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();

        if (!$user) {
            $this->command->info('No users found, skipping LabelSeeder.');
            return;
        }

        $labels = [
            ['name' => 'Urgent', 'color' => '#dc2626'],  
            ['name' => 'Important', 'color' => '#f97316'],   
            ['name' => 'Work', 'color' => '#2563eb'],     
            ['name' => 'Personal', 'color' => '#16a34a'],  
            ['name' => 'To Review', 'color' => '#facc15'],   
            ['name' => 'Bug', 'color' => '#db2777'],        
            ['name' => 'Feature', 'color' => '#8b5cf6'],    
            ['name' => 'Documentation', 'color' => '#78716c'],
        ];

        $data = array_map(function ($label) use ($user) {
            return [
                'user_id' => $user->id,
                'name' => $label['name'],
                'color' => $label['color'],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, $labels);

        DB::table('labels')->insert($data);
    }
}
