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
        Schema::create('applicant_employer_assignments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('applicant_id')
                ->constrained('applications')
                ->onDelete('cascade');

            $table->foreignId('employer_id')
                ->constrained('employers')
                ->onDelete('cascade');
                
            $table->string('job_title');
            $table->decimal('salary', 15, 2)->nullable();
            $table->timestamp('assigned_at')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applicant_employer_assignments');
    }
};
