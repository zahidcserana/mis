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
        Schema::create('investors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('uid')->unique();
            $table->string('name');
            $table->string('nickname')->nullable();
            $table->string('email')->unique();
            $table->text('permanent_address');
            $table->text('current_address');
            $table->json('personal_info')->nullable();
            $table->string('mobile');
            $table->string('emergency_mobile')->nullable();
            $table->enum('status', ['pending', 'active'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('investors');
    }
};