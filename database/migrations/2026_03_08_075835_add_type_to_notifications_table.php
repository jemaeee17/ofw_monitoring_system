<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Notification;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add 'type' column if it doesn't exist
        if (!Schema::hasColumn('notifications', 'type')) {
            Schema::table('notifications', function (Blueprint $table) {
                $table->string('type')->nullable()->after('user_id');
            });
        }

        // Populate existing notifications
        Notification::whereNull('user_id')->update(['type' => 'admin']);   // superadmin/system notifications
        Notification::whereNotNull('user_id')->update(['type' => 'agency']); // agency notifications
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};