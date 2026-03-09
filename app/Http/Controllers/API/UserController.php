<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function getAgencies()
    {
        $agencies = User::where('role', 'agency')
            ->get(['id', 'name', 'status']);

        return response()->json($agencies);
    }

    public function getAgency($id)
    {
        $agency = User::where('role', 'agency')->findOrFail($id);
        return response()->json($agency);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email',
        ]);

        $agency = User::create([
            'name' => $request->name,
            'email' => $request->email ?? null,
            'role' => 'agency',
            'status' => 'Active',
            'password' => Hash::make('defaultpassword'),
        ]);

        return response()->json($agency, 201);
    }

    public function registerAgency(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $agency = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => 'agency',
            'status' => 'Active',
            'password' => Hash::make($request->password),
        ]);

        \App\Models\Notification::create([
            'user_id' => null,
            'type' => 'admin',
            'message' => "{$agency->name} has been registered.",
            'is_read' => false,
        ]);


        return response()->json([
            'message' => 'Agency registered successfully',
            'agency' => $agency
        ], 201);
    }

    public function getTotalAgencies()
    {
        $total = User::where('role', 'agency')->count();

        return response()->json(['totalAgencies' => $total]);
    }

    public function getActiveAgencies()
    {
        $activeCount = User::where('role', 'agency')
            ->where('status', 'Active')
            ->count();

        return response()->json(['activeAgencies' => $activeCount]);
    }

    public function getTotalOfws()
    {
        $totalOfws = User::where('role', 'ofw')->count();

        return response()->json(['totalOfws' => $totalOfws]);
    }

    public function blockAgency($id)
    {
        $agency = User::find($id);

        if (!$agency) {
            return response()->json(['message' => 'Agency not found'], 404);
        }

        $agency->status = 'Blocked';
        $agency->save();

        \App\Models\Notification::create([
            'user_id' => null,
            'type' => 'admin',
            'message' => "Agency {$agency->name} has been blocked",
            'is_read' => false,
        ]);

        \App\Models\Notification::create([
            'user_id' => $agency->id,
            'message' => "Your account has been blocked by admin.",
            'is_read' => false,
        ]);

        return response()->json([
            'message' => 'Agency has been blocked.',
            'agency' => $agency
        ]);
    }

    public function reactivateAgency($id)
    {
        $agency = User::find($id);

        if (!$agency) {
            return response()->json(['message' => 'Agency not found'], 404);
        }

        $agency->status = 'Active';
        $agency->save();

        \App\Models\Notification::create([
            'user_id' => null,
            'type' => 'admin',
            'message' => "Agency {$agency->name} has been reactivated",
            'is_read' => false,
        ]);

        \App\Models\Notification::create([
            'user_id' => $agency->id,
            'message' => "Your account has been reactivated by admin.",
            'is_read' => false,
        ]);

        return response()->json([
            'message' => 'Agency has been reactivated.',
            'agency' => $agency
        ]);
    }

    public function blockedCount()
    {
        $blockedAgencies = User::where('status', 'Blocked')->count();
        return response()->json(['blockedAgencies' => $blockedAgencies]);
    }

    public function updateAgencySettings(Request $request, $id)
    {
        $agency = User::findOrFail($id);

        $request->validate([
            'email' => 'required|email|unique:users,email,' . $agency->id,
            'current_password' => 'nullable|string',
            'new_password' => 'nullable|string|min:6'
        ]);

        $agency->email = $request->email;

        if ($request->new_password) {

            if (!Hash::check($request->current_password, $agency->password)) {
                return response()->json([
                    'message' => 'Current password is incorrect'
                ], 400);
            }

            $agency->password = Hash::make($request->new_password);
        }

        $agency->save();

        return response()->json([
            'message' => 'Settings updated successfully',
            'agency' => $agency
        ]);
    }
}