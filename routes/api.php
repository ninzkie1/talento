<?php
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PerformerController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\CommentController;




use App\Http\Controllers\UserController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::group(['middleware' => ['auth:sanctum', 'admin']], function () {
    Route::get('/users', [AdminController::class, 'index']); // List all users
    Route::get('/users/{id}', [AdminController::class, 'show']); // Retrieve a specific user
    Route::post('/users', [AdminController::class, 'store']); // Create a new user
    Route::put('/users/{id}', [AdminController::class, 'update']); // Update a user
    Route::delete('/users/{id}', [AdminController::class, 'destroy']); // Delete a user
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/users', [UserController::class, 'store']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/performer', [PerformerController::class, 'index']);
    Route::get('/performer/{userId}', [PerformerController::class, 'show']);
    Route::post('/performer/{userId}', [PerformerController::class, 'update']);

});
Route::get('/chats', [ChatController::class, 'index']);
Route::post('/chats', [ChatController::class, 'store']);
Route::get('/users', [UserController::class, 'index']);

Route::get('/posts', [CustomerController::class, 'index']); // Get all posts
Route::post('/posts', [CustomerController::class, 'store']); // Create a new post
Route::put('/posts/{id}', [CustomerController::class, 'update']); // Update a post
Route::delete('/posts/{id}', [CustomerController::class, 'destroy']); // Delete a post

Route::get('/transactions', [TransactionController::class, 'index']); // Fetch all transactions
Route::get('/transactions/{id}', [TransactionController::class, 'show']); // Fetch a specific transaction by ID
Route::post('/transactions', [TransactionController::class, 'store']); // Create a new transaction

// routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::post('comments', [CommentController::class, 'store']);
    Route::get('posts/{post}/comments', [CommentController::class, 'index']);
});
