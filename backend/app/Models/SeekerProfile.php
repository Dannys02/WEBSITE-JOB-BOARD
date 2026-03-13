<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeekerProfile extends Model
{
  use HasFactory;

  protected $fillable = [
    'user_id',
    'bio',
    'skills',
    'portfolio_url',
    'resume_path',
  ];

  public function user() {
    return $this->belongsTo(User::class);
  }
}