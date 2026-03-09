<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('complaints', function (Blueprint $table) {
            $table->string('status')->default('pending')->after('complaint');
        });

        Schema::table('urgent_complaints', function (Blueprint $table) {
            $table->string('status')->default('pending')->after('address');
        });
    }

    public function down(): void
    {
        Schema::table('complaints', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('urgent_complaints', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};