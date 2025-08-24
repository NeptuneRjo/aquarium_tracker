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
        Schema::create('param_nodes', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->decimal('param_value', total: 8, places: 3);
            $table->ulid('param_node_ulid');
            $table->string('clerk_id', length: 48);
            $table->foreignId('param_id')->constrained()->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('param_nodes');
    }
};
