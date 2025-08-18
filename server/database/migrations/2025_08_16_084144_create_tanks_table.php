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
        Schema::create('tanks', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string("tank_name", length: 64);
            $table->string("tank_description", length: 256);
            $table->string('clerk_id', length: 48)->unique();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tanks');
    }
};
