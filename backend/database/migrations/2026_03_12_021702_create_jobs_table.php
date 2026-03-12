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
    Schema::create('jobs', function (Blueprint $table) {
      $table->id();
      $table->foreignId('company_id')->constrained()->cascadeOnDelete();
      $table->foreignId('category_id')->constrained()->cascadeOnDelete();
      $table->string('title');
      $table->text('description');
      $table->enum('type', ['full-time', 'part-time', 'freelance', 'internship']);
      $table->string('location');
      $table->unsignedBigInteger('salary_min')->nullable();
      $table->unsignedBigInteger('salary_max')->nullable();
      $table->date('deadline')->nullable();
      $table->enum('status', ['active', 'closed'])->default('active');
        $table->timestamps();
      });
    }

    /**
    * Reverse the migrations.
    */
    public function down(): void
    {
      Schema::dropIfExists('jobs');
    }
  };