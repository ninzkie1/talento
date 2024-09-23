<?php
// CommentController.php
namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    // CommentController.php

    public function store(Request $request)
    {
        // Validate the incoming comment data
        $validatedData = $request->validate([
            'post_id' => 'required|exists:posts,id',
            'content' => 'required|string',
        ]);
    
        // Create the comment in the database
        $comment = Comment::create([
            'post_id' => $validatedData['post_id'],
            'user_id' => auth()->id(), // Assuming the user is authenticated via Sanctum
            'content' => $validatedData['content'],
        ]);
    
        // Return the comment as a JSON response
        return response()->json($comment, 201);
    }
    
    public function index($postId)
    {
        $comments = Comment::where('post_id', $postId)->with('user')->get();
        return response()->json($comments);
    }
}
