<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmployerController extends Controller
{
  // Ambil semua job milik employer yang sedang login
  // whereHas = filter job yang company-nya punya user_id sama dengan yang login
  public function index() {
    $jobs = Job::with('category')
    ->whereHas('company', function ($q) {
      $q->where('user_id', Auth::id());
    })->latest()->get();

    return response()->json($jobs);
  }

  // Buat lowongan baru
  // Auth::user()->company = ambil relasi company dari user yang login
  // Kalau employer belum punya company, tolak dengan 403 Forbidden
  public function store(Request $request) {
    $request->validate([
      'category_id' => 'required|exists:categories,id',
      'title' => 'required|string|max:255',
      'description' => 'required|string',
      'type' => 'required|in:full-time,part-time,freelance,internship',
      'location' => 'required|string',
      'salary_min' => 'nullable|integer',
      'salary_max' => 'nullable|integer',
      'deadline' => 'nullable|date',
    ]);

    $company = Auth::user()->company;

    if (!$company) {
      return response()->json([
        'message' => 'Kamu belum memiliki profil perusahaan.'
      ], 403);
    }

    $job = Job::create([
      'company_id' => $company->id,
      'category_id' => $request->category_id,
      'title' => $request->title,
      'description' => $request->description,
      'type' => $request->type,
      'location' => $request->location,
      'salary_min' => $request->salary_min,
      'salary_max' => $request->salary_max,
      'deadline' => $request->deadline,
    ]);

    return response()->json([
      'message' => 'Lowongan berhasil dibuat',
      'job' => $job,
    ], 201);
  }

  // Update lowongan — hanya job milik employer sendiri yang bisa diedit
  // 'sometimes' = field boleh tidak dikirim, tapi kalau dikirim harus valid
  // $request->all() = ambil semua input dan langsung update
  public function update(Request $request, $id) {
    $job = Job::whereHas('company', function ($q) {
      $q->where('user_id', Auth::id());
    })->findOrFail($id);

    $request->validate([
      'category_id' => 'sometimes|exists:categories,id',
      'title' => 'sometimes|string|max:255',
      'description' => 'sometimes|string',
      'type' => 'sometimes|in:full-time,part-time,freelance,internship',
      'location' => 'sometimes|string',
      'salary_min' => 'nullable|integer',
      'salary_max' => 'nullable|integer',
      'deadline' => 'nullable|date',
      'status' => 'sometimes|in:active,closed',
    ]);

    $job->update($request->all());

    return response()->json([
      'message' => 'Lowongan berhasil diupdate',
      'job' => $job,
    ]);
  }

  // Hapus lowongan — hanya job milik employer sendiri
  public function destroy($id) {
    $job = Job::whereHas('company', function ($q) {
      $q->where('user_id', Auth::id());
    })->findOrFail($id);

    $job->delete();

    return response()->json([
      'message' => 'Lowongan berhasil dihapus',
    ]);
  }

  // Ambil semua pelamar untuk satu job milik employer
  // with('user') = eager load data user si pelamar sekaligus
  public function applicants($id) {
    $job = Job::whereHas('company', function ($q) {
      $q->where('user_id', Auth::id());
    })->findOrFail($id);

    $applicants = Application::with('user')
    ->where('job_id', $job->id)
    ->latest()
    ->get();

    return response()->json($applicants);
  }

  // Update status lamaran (pending → reviewed → accepted/rejected)
  // whereHas('job.company') = pastikan lamaran ini milik job yang punya employer ini
  // Ini penting untuk keamanan, employer tidak bisa ubah status lamaran orang lain
  public function updateStatus(Request $request, $id) {
    $application = Application::whereHas('job.company', function ($q) {
      $q->where('user_id', Auth::id());
    })->findOrFail($id);

    $request->validate([
      'status' => 'required|in:pending,reviewed,accepted,rejected',
    ]);

    $application->update(['status' => $request->status]);

    return response()->json([
      'message' => 'Status pelamar berhasil diupdate',
      'application' => $application,
    ]);
  }
}