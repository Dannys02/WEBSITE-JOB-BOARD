<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;

class AuthController extends Controller
{
  public function register(Request $request) {
    $request->validate([
      'name' => 'required|string|max:255',
      'email' => 'required|email|unique:users',
      'password' => 'required|min:8|confirmed',
      'role' => 'required|in:seeker,employer',
    ]);

    $user = User::create([
      'name' => $request->name,
      'email' => $request->email,
      'password' => Hash::make($request->password),
      'role' => $request->role,
    ]);

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
      'message' => 'Register berhasil',
      'user' => $user,
      'token' => $token,
    ], 201);
  }

  public function login(Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->input('email'))->first();

    if (!$user || Hash::check($request->input('password'), $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['Email atau password salah.'],
        ]);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'Login berhasil',
        'user' => $user,
        'token' => $token,
    ]);
  }

  public function logout(Request $request) {
    $request->user()->currentAccesToken()->delete();
    return response->json([
        'message' => 'Logout berhasil',
    ]);
  }
}
