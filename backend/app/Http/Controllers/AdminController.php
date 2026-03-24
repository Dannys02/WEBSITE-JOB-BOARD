<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Job;
use App\Models\Application;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // Statistik ringkasan untuk dashboard admin
    public function stats()
    {
        return response()->json([
            'total_users' => User::count(),
            'total_jobs' => Job::count(),
            'total_applications' => Application::count(),
            'active_jobs' => Job::where('status', 'active')->count(),
        ]);
    }

    // Ambil semua user
    public function users()
    {
        $users = User::latest()->paginate(20);

        return response()->json($users);
    }

    // Aktifkan atau nonaktifkan user
    public function toggleUserStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $user->update(['is_active' => $request->is_active]);

        return response()->json([
            'message' => 'Status user berhasil diupdate',
            'user' => $user,
        ]);
    }

    // Ambil semua job (semua status)
    public function jobs()
    {
        $jobs = Job::with(['company', 'category'])
            ->latest()
            ->paginate(20);

        return response()->json($jobs);
    }

    // Update status job (approve/reject)
    public function updateJobStatus(Request $request, $id)
    {
        $job = Job::findOrFail($id);

        $request->validate([
            'status' => 'required|in:active,closed',
        ]);

        $job->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Status lowongan berhasil diupdate',
            'job' => $job,
        ]);
    }

    // Hapus job manapun
    public function destroyJob($id)
    {
        $job = Job::findOrFail($id);
        $job->delete();

        return response()->json([
            'message' => 'Lowongan berhasil dihapus',
        ]);
    }
}