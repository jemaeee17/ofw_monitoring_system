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
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->string('ref_code')->nullable();
            $table->string('position')->nullable();
            $table->string('full_name');
            $table->text('address')->nullable();
            $table->date('birthdate')->nullable();
            $table->string('place_of_birth')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('email')->nullable();
            $table->string('gender')->nullable();
            $table->string('religion')->nullable();
            $table->string('passport_number')->nullable();
            $table->string('passport_issue_place')->nullable();
            $table->date('passport_expiry')->nullable();
            $table->string('college')->nullable();
            $table->string('highschool')->nullable();
            $table->string('vocational')->nullable();
            $table->string('civil_status')->nullable();
            $table->integer('height')->nullable();
            $table->integer('weight')->nullable();
            $table->date('deployment_date')->nullable();
            $table->date('application_date')->nullable();
            $table->text('notes')->nullable();
            $table->text('languages')->nullable();
            $table->text('work_history')->nullable();
            $table->text('skills')->nullable();
            $table->text('objective')->nullable();
            $table->string('photo')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};