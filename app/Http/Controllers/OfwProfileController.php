<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OfwProfile;

class OfwProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

        $profile = OfwProfile::firstOrCreate(
            ['user_id' => $user->id],
            [
                'name' => $user->name,
                'email' => $user->email
            ]
        );

        return response()->json($profile);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'address' => 'nullable|string|max:500',
            'birthdate' => 'nullable|date',
            'phone' => 'nullable|string|max:20',
            'gender' => 'nullable|string|in:Male,Female,Other',
            'photo' => 'nullable|image|max:2048',
        ]);

        $profile = OfwProfile::firstOrCreate(
            ['user_id' => $user->id],
            [
                'name' => $user->name,
                'email' => $user->email,
                'address' => $request->address,
                'birthdate' => $request->birthdate,
                'phone' => $request->phone,
                'gender' => $request->gender,
            ]
        );

        if ($request->hasFile('photo') && $request->file('photo')->isValid()) {
            $profile->photo = $request->file('photo')->store('ofw_profiles', 'public');
            $profile->save();
        }

        return response()->json([
            'message' => 'Profile saved successfully',
            'profile' => $profile,
        ], 201);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $profile = OfwProfile::firstOrCreate(
            ['user_id' => $user->id],
            ['name' => $user->name, 'email' => $user->email]
        );

        $request->validate([
            'address' => 'nullable|string|max:500',
            'birthdate' => 'nullable|date',
            'phone' => 'nullable|string|max:20',
            'gender' => 'nullable|string|in:Male,Female,Other',
            'photo' => 'nullable|image|max:2048',
        ]);

        $profile->update([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'phone' => $request->input('phone'),
            'address' => $request->input('address'),
            'birthdate' => $request->input('birthdate'),
            'gender' => $request->input('gender'),
        ]);

        if ($request->hasFile('photo') && $request->file('photo')->isValid()) {
            $profile->photo = $request->file('photo')->store('ofw_profiles', 'public');
            $profile->save();
        }

        return response()->json([
            'message' => 'Profile updated successfully',
            'profile' => $profile,
        ]);
    }
}
