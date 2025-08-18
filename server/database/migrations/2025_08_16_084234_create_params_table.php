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
        Schema::create('params', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string("param_name", length: 32);
            $table->string("param_unit", length: 16);
            $table->foreignId('tank_ulid')->constrained()->onDelete('cascade');
            $table->ulid('param_ulid');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('params');
    }
};
