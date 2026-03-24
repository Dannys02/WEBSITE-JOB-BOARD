<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Job;

class JobController extends Controller
{
  // Ambil semua job aktif, dengan filter opsional dari query string
  // Contoh: /api/jobs?search=developer&category_id=1&type=full-time
  public function index(Request $request) {
    $query = Job::with(['company', 'category'])->where('status', 'active');

    // Filter by keyword di kolom title
    if ($request->search) {
      $query->where('title', 'like', '%' . $request->search . '%');
    }

    // Filter by kategori
    if ($request->category_id) {
      $query->where('category_id', $request->category_id);
    }

    // Filter by tipe kerja (full-time, part-time, dll)
    if ($request->type) {
      $query->where('type', $request->type);
    }

    // Filter by lokasi
    if ($request->location) {
      // Seharusnya hanya 3 parameter: kolom, operator, nilai
      $query->where('location', 'like', '%' . $request->location . '%');
    }

    // Urutkan terbaru, batasi 10 per halaman
    return response()->json($query->latest()->paginate(10));
  }

  // Ambil detail satu job by id
  public function show($id) {
    $job = Job::with(['company', 'category'])->findOrFail($id);

    return response()->json($job);
  }
}