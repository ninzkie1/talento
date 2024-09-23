<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    // List all users
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    // Retrieve a specific user
    public function show($id)
{
    $user = User::find($id);

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    return response()->json([
        'id' => $user->id,
        'name' => $user->name,
        'lastname' => $user->lastname,
        'email' => $user->email,
        'password' => $user->password,
        'role' => $user->role,
    ]);
}


    // Create a new user
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,performer,customer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role,
        ]);

        return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
    }

    // Update a user
    public function update(Request $request, $id)
{
    $user = User::find($id);

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    // Custom error messages
    $messages = [
        'name.string' => 'The name field must be a string.',
        'name.max' => 'The name field may not be greater than 255 characters.',
        'lastname.string' => 'The lastname field must be a filled.',
        'lastname.max' => 'The lastname field may not be greater than 255 characters.',
        'email.email' => 'The email field must be a valid email address.',
        'email.unique' => 'The email address has already been taken.',
        'password.string' => 'The password field must be a string.',
        'password.min' => 'The password field must be at least 8 characters.',
        'role.in' => 'The role field must be one of the following: admin, performer, customer.',
    ];

    $validator = Validator::make($request->all(), [
        'name' => 'string|max:255',
        'lastname' => 'string|max:255',
        'email' => 'email|unique:users,email,' . $id,
        'password' => 'string|min:6',
        'role' => 'in:admin,performer,customer',
    ], $messages);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 400);
    }

    if ($request->has('name')) {
        $user->name = $request->name;
    }
    if ($request->has('lastname')) {
        $user->lastname = $request->lastname;
    }

    if ($request->has('email')) {
        $user->email = $request->email;
    }

    if ($request->has('password')) {
        $user->password = $request->password; 
    }

    if ($request->has('role')) {
        $user->role = $request->role;
    }

    $user->save();

    return response()->json(['message' => 'User updated successfully', 'user' => $user]);
}


    // Delete a user
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
