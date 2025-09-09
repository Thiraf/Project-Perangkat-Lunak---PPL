<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $parentId = $request->input('parent_id', null);

        $items = Item::where('owner_id', $user->id)
                     ->where('parent_id', $parentId)
                     ->with('owner')
                     ->get();

        // Add owner_name to each item
        $items = $items->map(function ($item) {
            $itemArr = $item->toArray();
            $itemArr['owner_name'] = $item->owner ? $item->owner->name : null;
            return $itemArr;
        });

        return response()->json($items);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // (Tambahkan validasi yang lebih baik menggunakan Form Request nanti)
        $validated = $request->validate([
            'name' => 'required_if:type,folder|string|max:255',
            'type' => 'required|in:folder,file',
            'parent_id' => 'nullable|exists:items,id',
            'file' => 'required_if:type,file|file|max:10240', // 10 MB limit
        ]);

        $user = Auth::user();
        $parentId = $validated['parent_id'] ?? null;
        
        $itemData = [
            'owner_id' => $user->id,
            'parent_id' => $parentId,
            'type' => $validated['type'],
        ];

        if ($validated['type'] === 'file') {
            $file = $validated['file'];
            $originalFullName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $baseName = pathinfo($originalFullName, PATHINFO_FILENAME);

            $finalName = $originalFullName;
            $counter = 1;

            // Terus periksa ke database dan cari nama unik jika nama file sudah ada
            while (Item::where('owner_id', $user->id)
                       ->where('parent_id', $parentId)
                       ->where('name', $finalName)
                       ->where('type', 'file')
                       ->exists()) 
            {
                $finalName = $baseName . '(' . $counter . ').' . $extension;
                $counter++;
            }

            $path = $file->store('files/' . $user->id, 'public');
            $itemData['name'] = $finalName;
            $itemData['path'] = $path;
            $itemData['mime_type'] = $file->getMimeType();
            $itemData['size'] = $file->getSize();

        } else { // type is 'folder'
            $originalFolderName = $validated['name'];
            $finalName = $originalFolderName;
            $counter = 1;

            // Lakukan pengecekan duplikasi nama untuk folder juga
            while (Item::where('owner_id', $user->id)
                       ->where('parent_id', $parentId)
                       ->where('name', $finalName)
                       ->where('type', 'folder')
                       ->exists())
            {
                $finalName = $originalFolderName . ' (' . $counter . ')';
                $counter++;
            }
            $itemData['name'] = $finalName;
            $itemData['path'] = 'folders/' . Str::uuid(); 
        }

        $item = Item::create($itemData);
        return response()->json($item, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = Auth::user();
        $item = Item::where('id', $id)->where('owner_id', $user->id)->first();
        if (!$item) {
            return response()->json(['error' => 'Item not found or unauthorized'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $item->name = $validated['name'];
        $item->save();

        return response()->json(['message' => 'Item renamed successfully', 'item' => $item]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = Auth::user();
        $item = Item::where('id', $id)->where('owner_id', $user->id)->first();
        if (!$item) {
            return response()->json(['error' => 'Item not found or unauthorized'], 404);
        }

        if ($item->type === 'file' && $item->path) {
            Storage::disk('public')->delete($item->path);
        }

        $item->delete();
        return response()->json(['message' => 'Item deleted successfully']);
    }
}
