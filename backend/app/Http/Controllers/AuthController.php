<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;

class AuthController extends Controller
{
  public function register(Request $request) {
    // Validasi input dari frontend
    $request->validate([
      'name' => 'required|string|max:255',
      'email' => 'required|email|unique:users', // email tidak boleh duplikat
      'password' => 'required|min:8|confirmed', // confirmed = harus ada password_confirmation
      'role' => 'required|in:seeker,employer', // hanya 2 pilihan role
    ]);

    // Simpan user baru, password di-hash agar tidak tersimpan plain text
    $user = User::create([
      'name' => $request->name,
      'email' => $request->email,
      'password' => Hash::make($request->password),
      'role' => $request->role,
    ]);

    // Buat token Sanctum untuk user yang baru register
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
      'message' => 'Register berhasil',
      'user' => $user,
      'token' => $token,
    ], 201); // 201 = Created
  }

  public function login(Request $request) {
    $request->validate([
      'email' => 'required|email',
      'password' => 'required',
    ]);

    // Cari user berdasarkan email
    $user = User::where('email', $request->input('email'))->first();

    if (!$user || !Hash::check($request->input('password'), $user->password)) {
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
    $request->user()->currentAccessToken()->delete(); // hapus token yang sedang dipakai

    return response()->json([
      'message' => 'Logout berhasil',
    ]);
  }

  public function me(Request $request) {
    // Kembalikan data user yang sedang login berdasarkan token
    return response()->json($request->user());
  }
}