<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CoHost;

class CoHostController extends Controller
{
    // Fetch all co-hosts
    public function index()
    {
        $coHosts = CoHost::all();
        return response()->json($coHosts);
    }

    // Fetch single co-host
    public function show($id)
    {
        $coHost = CoHost::findOrFail($id);
        return response()->json($coHost);
    }

    // Create new co-host
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'contact' => 'nullable|string|max:255',
        ]);

        $coHost = CoHost::create($data);

        return response()->json([
            'message' => 'Co-host added successfully',
            'coHost' => $coHost
        ]);
    }

    // Update co-host
    public function update(Request $request, $id)
    {
        $coHost = CoHost::findOrFail($id);

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

    // Delete co-host
    public function destroy($id)
    {
        $coHost = CoHost::findOrFail($id);
        $coHost->delete();

        return response()->json(['message' => 'Co-host deleted successfully']);
    }
}