<?php
namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index()
    {
        // Fetch all posts from the database and return as JSON
        $posts = Post::all()->map(function ($post) {
            // Ensure talents is decoded to array before returning to the frontend
            $post->talents = json_decode($post->talents, true);
            return $post;
        });

        return response()->json($posts);
    }

    public function store(Request $request)
    {
        // Validate the incoming request
        $validatedData = $request->validate([
            'clientName' => 'required|string|max:255',
            'eventName' => 'required|string|max:255',
            'startTime' => 'required',
            'endTime' => 'required',
            'description' => 'required|string',
            'talents' => 'required|array',
        ]);

        // Save the post to the database
        $post = Post::create([
            'client_name' => $validatedData['clientName'],
            'event_name' => $validatedData['eventName'],
            'start_time' => $validatedData['startTime'],
            'end_time' => $validatedData['endTime'],
            'description' => $validatedData['description'],
            'talents' => json_encode($validatedData['talents']), // Save talents as a JSON string
        ]);

        return response()->json($post, 201);
    }

    public function update(Request $request, $id)
    {
        // Validate the incoming request
        $validatedData = $request->validate([
            'clientName' => 'required|string|max:255',
            'eventName' => 'required|string|max:255',
            'startTime' => 'required',
            'endTime' => 'required',
            'description' => 'required|string',
            'talents' => 'required|array',
        ]);

        // Find and update the post
        $post = Post::findOrFail($id);
        $post->update([
            'client_name' => $validatedData['clientName'],
            'event_name' => $validatedData['eventName'],
            'start_time' => $validatedData['startTime'],
            'end_time' => $validatedData['endTime'],
            'description' => $validatedData['description'],
            'talents' => json_encode($validatedData['talents']), // Save talents as a JSON string
        ]);

        return response()->json($post, 200);
    }

    public function destroy($id)
    {
        // Find and delete the post
        $post = Post::findOrFail($id);
        $post->delete();

        return response()->json(null, 204); // Return 204 No Content after deletion
    }
}
