<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CoHost;

class CoHostController extends Controller
{
    public function index()
    {
        $userId = auth()->id();
        logger("Logged in user ID: {$userId}");

        $coHosts = CoHost::where('agency_id', auth()->id())->get();
        return response()->json($coHosts);
    }

    public function show($id)
    {
        $coHost = CoHost::where('id', $id)
            ->where('agency_id', auth()->id())
            ->firstOrFail();
        return response()->json($coHost);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'contact' => 'nullable|string|max:255',
        ]);

        $data['agency_id'] = auth()->id();

        $coHost = CoHost::create($data);

        return response()->json([
            'message' => 'Co-host added successfully',
            'coHost' => $coHost
        ]);
    }

    public function update(Request $request, $id)
    {
        $coHost = CoHost::where('id', $id)
            ->where('agency_id', auth()->id())
            ->firstOrFail();

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'contact' => 'nullable|string|max:255',
        ]);

        $coHost->update($data);

        return response()->json([
            'message' => 'Co-host updated successfully',
            'coHost' => $coHost
        ]);
    }

    public function destroy($id)
    {
        $coHost = CoHost::where('id', $id)
            ->where('agency_id', auth()->id())
            ->firstOrFail();

        $coHost->delete();

        return response()->json(['message' => 'Co-host deleted successfully']);
    }

    public function publicIndex()
    {
        return CoHost::select('id', 'name')->orderBy('name')->get();
    }
}