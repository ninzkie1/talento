<?php
namespace App\Http\Controllers;

use App\Models\PerformerPortfolio;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class PerformerController extends Controller
{
    public function show($userId)
    {
        $user = User::find($userId);
        $portfolio = PerformerPortfolio::where('user_id', $userId)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if (!$portfolio) {
            $portfolio = new PerformerPortfolio([
                'event_name' => '',
                'theme_name' => '',
                'talent_name' => '',
                'location' => '',
                'description' => '',
                'rate' => 0
            ]);
        }

        return response()->json([
            'user' => $user,
            'portfolio' => $portfolio
        ]);
    }

    public function update(Request $request, $userId)
    {
        $user = User::find($userId);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'event_name' => 'nullable|string|max:255',
            'theme_name' => 'nullable|string|max:255',
            'talent_name' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'rate' => 'nullable|integer|min:0',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        if ($request->hasFile('profile_image')) {
            // Delete the old image if it exists
            if ($user->image_profile) {
                Storage::disk('public')->delete($user->image_profile);
            }
            $imagePath = $request->file('profile_image')->store('profile_images', 'public');
            $user->image_profile = $imagePath;
        }

        $user->save();

        $portfolio = PerformerPortfolio::updateOrCreate(
            ['user_id' => $userId],
            [
                'event_name' => $request->input('event_name'),
                'theme_name' => $request->input('theme_name'),
                'talent_name' => $request->input('talent_name'),
                'location' => $request->input('location'),
                'description' => $request->input('description'),
                'rate' => $request->input('rate'),
            ]
        );

        return response()->json(['message' => 'Performer portfolio updated successfully', 'portfolio' => $portfolio, 'user' => $user]);
    }
}
