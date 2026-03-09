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
        Schema::table('urgent_complaints', function (Blueprint $table) {
            $table->dropColumn(['email', 'primary_contact', 'secondary_contact', 'complaint']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('urgent_complaints', function (Blueprint $table) {
            $table->string('email')->nullable();
            $table->string('primary_contact')->nullable();
            $table->string('secondary_contact')->nullable();
            $table->text('complaint')->nullable();
        });
    }
};
