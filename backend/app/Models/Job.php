<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
  use HasFactory;

  protected $fillable = [
    'company_id',
    'category_id',
    'title',
    'description',
    'type',
    'location',
    'salary_min',
    'salary_max',
    'deadline',
    'status',
  ];

  public function company() {
    return $this->belongsTo(Company::class);
  }

  public function category() {
    return $this->belongsTo(Category::class);
  }

  public function applications() {
    return $this->hasMany(Application::class);
  }
}