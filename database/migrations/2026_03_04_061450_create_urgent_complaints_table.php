<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('urgent_complaints', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('co_host_id')->nullable(); 
            $table->string('ofw_name');
            $table->string('email');
            $table->string('primary_contact')->nullable();
            $table->string('secondary_contact')->nullable();
            $table->text('complaint')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('city')->nullable();
            $table->string('address')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('urgent_complaints');
    }
};
