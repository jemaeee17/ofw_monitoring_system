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
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();

            $table->foreignId('co_host_id')->constrained()->cascadeOnDelete();

            // General Information
            $table->string('ofw_name');
            $table->string('gender')->nullable();
            $table->date('birthdate')->nullable();
            $table->string('occupation')->nullable();
            $table->string('national_id')->nullable();
            $table->string('passport_no')->nullable();

            // Contact Information
            $table->string('email')->nullable();
            $table->string('contact_person')->nullable();
            $table->string('primary_contact')->nullable();
            $table->string('secondary_contact')->nullable();
            $table->text('address_abroad')->nullable();

            // Complaint
            $table->text('complaint');

            // Images
            $table->string('image1')->nullable();
            $table->string('image2')->nullable();
            $table->string('image3')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
