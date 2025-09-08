<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('item_labels', function (Blueprint $table) {
            $table->foreignId('label_id')->constrained('labels')->onDelete('cascade');
            $table->unsignedBigInteger('item_id');
            $table->string('item_type'); // Untuk polymorphic, merujuk ke model Item

            // Primary key gabungan untuk mencegah duplikasi label pada item yang sama
            $table->primary(['label_id', 'item_id', 'item_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_labels');
    }
};
