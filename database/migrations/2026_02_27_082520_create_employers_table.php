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
        Schema::create('employers', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->string('business_type')->nullable();
            $table->string('industry_sector')->nullable();
            $table->string('cr_number')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->text('regional_office_address')->nullable();
            $table->string('poc_name')->nullable();
            $table->string('poc_contact_number')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employers');
    }
};