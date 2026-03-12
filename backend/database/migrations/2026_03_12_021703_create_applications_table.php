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
    Schema::create('applications', function (Blueprint $table) {
      $table->id();
      $table->foreignId('job_id')->constrained()->cascadeOnDelete();
      $table->foreignId('user_id')->constrained()->cascadeOnDelete();
      $table->string('cv_path');
      $table->text('cover_letter')->nullable();
      $table->enum('status', ['pending', 'reviewed', 'accepted', 'rejected'])->default('pending');
        $table->timestamp('applied_at')->useCurrent();
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