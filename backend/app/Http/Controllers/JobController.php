<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Job;

class JobController extends Controller
{
    public function index(Request $request) {
        $query = Job::where(['company', 'category'])->where('status', 'active');

        if ($request->search) {
            $query->where('title', 'like', '%' . $request->search .'%');
        }

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->type) {
            $query->where('type', $request->type);
        }

        if ($request->location) {
            $query->where('location', 'like', '%', '%' . $request->location . '%');
        }

        return response()->json($query->latest()->paginate(10));
    }

    public function show($id) {
        $job = Job::where(['company', 'category'])->findOrFail($id);

        return response()->json($job);
    }
}
