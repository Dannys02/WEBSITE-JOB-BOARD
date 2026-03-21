<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmployerController extends Controller
{
  public function index() {
    $jobs = Job::with('category')
    ->whereHas('company', function ($q) {
      $q->where('user_id', Auth::id());
    })->latest()->get();

    return response()->json($jobs);
  }

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

  public function destroy($id) {
    $job = Job::whereHas('company', function ($q) {
      $q->where('user_id', Auth::id());
    })->findOrFail($id);

    $job->delete();

    return response()->json([
      'message' => 'Lowongan berhasil dihapus',
    ]);
  }

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