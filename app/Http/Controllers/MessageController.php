<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;

class MessageController extends Controller
{
    public function getConversation($id)
    {
        return Message::where('conversation_id', $id)
            ->orderBy('created_at')
            ->get();
    }

    public function reply(Request $request)
    {
        $request->validate([
            'conversation_id' => 'required|integer',
            'message' => 'required|string'
        ]);

        $user = auth()->user();

        $conversation = Message::where('conversation_id', $request->conversation_id)->first();

        if (!$conversation) {
            return response()->json([
                'error' => 'Conversation not found'
            ], 404);
        }

        // determine sender by role
        if ($user->role === 'admin') {
            $sender = 'admin';
        } elseif ($user->id == $conversation->ofw_id) {
            $sender = 'ofw';
        } else {
            $sender = 'agency';
        }

        $message = Message::create([
            'conversation_id' => $request->conversation_id,
            'agency_id' => $conversation->agency_id,
            'ofw_id' => $conversation->ofw_id,
            'sender' => $sender,
            'message' => $request->message,
        ]);

        return response()->json($message);
    }

    public function ofwConversation($conversationId)
    {
        $messages = Message::where('conversation_id', $conversationId)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }
}
