<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\EmergencyCode;

class EmergencyController extends Controller
{
    public function sendCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', $request->email)->where('role', 'ofw')->first();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $code = rand(100000, 999999);

        EmergencyCode::updateOrCreate(
            ['user_id' => $user->id],
            ['code' => $code, 'expires_at' => now()->addMinutes(10)]
        );

        Mail::raw("Your emergency code is: $code", function ($message) use ($user) {
            $message->to($user->email)
                ->subject('Emergency Verification Code');
        });

        return response()->json(['message' => 'Code sent successfully']);
    }

    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required'
        ]);

        $user = User::where('email', $request->email)->where('role', 'ofw')->first();
        if (!$user) {
            return response()->json(['verified' => false, 'message' => 'User not found'], 404);
        }

        $emergencyCode = EmergencyCode::where('user_id', $user->id)
            ->where('code', $request->code)
            ->where('expires_at', '>', now())
            ->first();

        if ($emergencyCode) {
            $emergencyCode->delete();
            return response()->json(['verified' => true]);
        }

        return response()->json(['verified' => false, 'message' => 'Invalid or expired code']);
    }
}
