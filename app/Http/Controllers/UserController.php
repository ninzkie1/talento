<?php
// app/Http/Controllers/UserController.php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\PerformerPortfolio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::where('role', '!=', 'admin')->get();
        return response()->json($users);
    }
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|max:255',
            'image_profile' => 'required|string|max:255',
        ]);

        $user = new User();
        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->role = $request->role;
        $user->image_profile = $request->image_profile;
        $user->save();

        // Optionally create a portfolio entry
        if ($request->has('portfolio')) {
            $portfolio = new PerformerPortfolio();
            $portfolio->user_id = $user->id;
            $portfolio->talent_id = $request->portfolio['talent_id'];
            $portfolio->avail_id = $request->portfolio['avail_id'];
            $portfolio->video = $request->portfolio['video'];
            $portfolio->rating_id = $request->portfolio['rating_id'];
            $portfolio->save();
        }

        return response()->json(['message' => 'User created successfully'], 201);
    }
}
