<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $parentId = $request->input('parent_id', null);
        $label = $request->input('label', null);

        $query = Item::where(function($q) use ($user) {
            $q->where('owner_id', $user->id)
              ->orWhereHas('sharedWithUsers', function($q2) use ($user) {
                  $q2->where('users.id', $user->id);
              });
        });

        if (!is_null($parentId)) {
            $query = $query->where('parent_id', $parentId);
        }

        if ($label) {
            $query = $query->whereIn('id', function($sub) use ($label) {
                $sub->select('item_id')
                    ->from('item_labels')
                    ->where('item_type', 'file')
                    ->whereIn('label_id', function($labelSub) use ($label) {
                        $labelSub->select('id')
                            ->from('labels')
                            ->where('name', $label);
                    });
            });
        }

        $items = $query->with('owner')->get();

        $items = $items->map(function ($item) use ($user) {
            $itemArr = $item->toArray();
            $itemArr['owner_name'] = $item->owner ? $item->owner->name : null;
            if ($item->owner_id === $user->id) {
                $itemArr['shared_permission'] = null;
            } else {
                $share = \App\Models\Share::where('item_id', $item->id)->where('user_id', $user->id)->first();
                $itemArr['shared_permission'] = $share ? $share->permission : null;
            }
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

        try {
            $validated = $request->validate([
                'name' => 'required_if:type,folder|string|max:255',
                'type' => 'required|in:folder,file',
                'parent_id' => 'nullable|exists:items,id',
                'file' => [
                    'required_if:type,file',
                    'file',
                    'max:10240', // 10 MB
                    'mimes:jpg,jpeg,png,pdf,doc,docx,xlsx,xls,ppt,pptx,csv,txt', // allowed types
                ],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            $errors = $e->validator->errors();
            if ($errors->has('file')) {
                $fileErrors = $errors->get('file');
                if (collect($fileErrors)->contains(fn($msg) => str_contains($msg, 'max'))) {
                    return response()->json(['error' => 'File too large. Maximum size is 10MB.'], 413);
                }
            }
            return response()->json(['error' => $errors->first()], 422);
        }

        if (!$request->hasFile('file') && ($validated['type'] ?? null) === 'file') {
            return response()->json(['error' => 'File upload failed. Please check your connection or try again.'], 408);
        }

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

        } else {
            $originalFolderName = $validated['name'];
            $finalName = $originalFolderName;
            $counter = 1;

            while (Item::where('owner_id', $user->id)
                       ->where('parent_id', $parentId)
                       ->where('name', $finalName)
                       ->where('type', 'folder')
                       ->exists())
            {
                $finalName = $originalFolderName .'(' . $counter . ')';
                $counter++;
            }
            $itemData['name'] = $finalName;
            $itemData['path'] = 'folders/' . Str::uuid(); 
        }

        $item = Item::create($itemData);

        $labelIds = $request->input('labels', $request->input('labels', []));
        if (!empty($labelIds) && is_array($labelIds)) {
            $itemType = isset($item->type) ? $item->type : null;
            foreach ($labelIds as $labelId) {
                DB::table('item_labels')->insert([
                    'label_id' => $labelId,
                    'item_id' => $item->id,
                    'item_type' => $itemType,
                ]);
            }
        }

        if ($parentId) {
            $parentFolder = Item::where('id', $parentId)->where('type', 'folder')->first();
            if ($parentFolder) {
                $sharedUsers = $parentFolder->sharedWithUsers;
                foreach ($sharedUsers as $sharedUser) {
                    $item->sharedWithUsers()->syncWithoutDetaching([
                        $sharedUser->id => ['permission' => $sharedUser->pivot->permission]
                    ]);
                }
            }
        }

        return response()->json($item, 201);
    }

    /**
     * Display the specified resource.
     */
    public function search(Request $request)
    {
        $user = Auth::user();
        $q = trim($request->input('q', ''));

        if ($q === '') {
            return response()->json(['folders' => [], 'files' => []]);
        }

        $folders = Item::where(function($q) use ($user) {
                $q->where('owner_id', $user->id)
                    ->orWhereHas('sharedWithUsers', function($q2) use ($user) {
                        $q2->where('users.id', $user->id);
                    });
            })
            ->where('type', 'folder')
            ->where('name', 'like', '%' . $q . '%')
            ->orderBy('name')
            ->limit(10)
            ->get(['id', 'name', 'owner_id']);

        $files = Item::where(function($q) use ($user) {
                $q->where('owner_id', $user->id)
                    ->orWhereHas('sharedWithUsers', function($q2) use ($user) {
                        $q2->where('users.id', $user->id);
                    });
            })
            ->where('type', 'file')
            ->where('name', 'like', '%' . $q . '%')
            ->orderBy('name')
            ->limit(10)
            ->with('parent:id,name')
            ->get(['id', 'name', 'owner_id', 'parent_id']);

        // include parent folder name in the response for UI convenience
        $files = $files->map(function ($f) {
            // prefer the eager-loaded relation if present
            $parentName = null;
            if ($f->relationLoaded('parent') && $f->parent) {
                $parentName = $f->parent->name;
            } elseif ($f->parent_id) {
                $parentName = Item::where('id', $f->parent_id)->value('name');
            }

            return [
                'id' => $f->id,
                'name' => $f->name,
                'owner_id' => $f->owner_id,
                'parent_id' => $f->parent_id,
                'parent_name' => $parentName,
                'type' => 'file',
            ];
        });

        return response()->json([
            'folders' => $folders,
            'files' => $files,
        ]);
    }

    public function show(string $id)
    {
        $user = Auth::user();
        $item = Item::find($id);
        if (!$item) {
            return response()->json(['error' => 'Item not found or unauthorized'], 404);
        }

        $canView = $item->owner_id === $user->id;

        if (!$canView && $item->parent_id) {
            $parentFolder = Item::where('id', $item->parent_id)->where('type', 'folder')->first();
            if ($parentFolder && $parentFolder->owner_id === $user->id) {
                $canView = true;
            }
        }

        if (!$canView) {
            $canView = $item->sharedWithUsers()->where('users.id', $user->id)->exists();
        }

        if (!$canView) {
            return response()->json(['error' => 'Item not found or unauthorized'], 404);
        }

        if ($item->type === 'folder') {
            return response()->json(['error' => 'Cannot preview a folder'], 400);
        }

        $item->url = Storage::url($item->path);

        return response()->json($item);
    }

    /**
     * Show the contents of a folder with breadcrumb.
     */
    public function folderView($userId, $id)
    {
        $authUser = Auth::user();

        $folder = Item::where('id', $id)
            ->where('type', 'folder')
            ->with([
                'parentRecursive.sharedWithUsers' => function ($query) use ($authUser) {
                    $query->where('users.id', $authUser->id);
                },
                'sharedWithUsers' => function ($query) use ($authUser) {
                    $query->where('users.id', $authUser->id);
                }
            ])
            ->firstOrFail();

        $canView = $folder->owner_id === $authUser->id || $folder->sharedWithUsers->isNotEmpty();
        if (!$canView) {
            abort(403, 'Unauthorized'); // If not, deny access.
        }

        $childrenQuery = Item::where('parent_id', $folder->id);

        if ($folder->owner_id !== $authUser->id) {
            $childrenQuery->where(function ($query) use ($authUser) {
                $query->where('owner_id', $authUser->id)
                      ->orWhereHas('sharedWithUsers', function ($q) use ($authUser) {
                          $q->where('users.id', $authUser->id);
                      });
            });
        }

        $children = $childrenQuery->with([
                'owner:id,name',
                'sharedWithUsers' => function ($query) use ($authUser) {
                    $query->where('users.id', $authUser->id);
                }
            ])
            ->get();

        $items = $children->map(function ($item) use ($authUser) {
            $sharedInfo = $item->sharedWithUsers->first();
            return [
                'id' => $item->id,
                'name' => $item->name,
                'type' => $item->type,
                'size' => $item->size,
                'owner_name' => $item->owner->name ?? 'Unknown',
                'owner_id' => $item->owner_id,
                'permission' => $item->owner_id === $authUser->id ? 'owner' : ($sharedInfo ? $sharedInfo->pivot->permission : null),
            ];
        });

        $breadcrumb = [];
        $current = $folder;
        while ($current) {
            $share = $current->sharedWithUsers->first();
            $permission = $current->owner_id === $authUser->id ? 'owner' : ($share ? $share->pivot->permission : null);

            $breadcrumb[] = [
                'id' => $current->id,
                'name' => $current->name,
                'permission' => $permission,
            ];
            $current = $current->parentRecursive;
        }
        $breadcrumb = array_reverse($breadcrumb);

        $folderPermission = $breadcrumb[count($breadcrumb) - 1]['permission'];

        return Inertia::render('FolderView', [
            'folder' => [
                'id' => $folder->id,
                'name' => $folder->name,
                'owner_id' => $folder->owner_id,
                'permission' => $folderPermission,
            ],
            'items' => $items,
            'breadcrumb' => $breadcrumb,
        ]);
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
        $item = Item::find($id);
        if (!$item) {
            return response()->json(['error' => 'Item not found or unauthorized'], 404);
        }

        $canEdit = false;
        if ($item->owner_id === $user->id) {
            $canEdit = true;
        } elseif ($item->parent_id) {
            $parentFolder = Item::where('id', $item->parent_id)->where('type', 'folder')->first();
            if ($parentFolder && $parentFolder->owner_id === $user->id) {
                $canEdit = true;
            }
        }
        if (!$canEdit) {
            return response()->json(['error' => 'Unauthorized'], 403);
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
        $item = Item::find($id);
        if (!$item) {
            return response()->json(['error' => 'Item not found or unauthorized'], 404);
        }

        $canEdit = false;
        if ($item->owner_id === $user->id) {
            $canEdit = true;
        } elseif ($item->parent_id) {
            $parentFolder = Item::where('id', $item->parent_id)->where('type', 'folder')->first();
            if ($parentFolder && $parentFolder->owner_id === $user->id) {
                $canEdit = true;
            }
        }
        if (!$canEdit) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($item->type === 'file' && $item->path) {
            Storage::disk('public')->delete($item->path);
        }

        $item->delete();
        return response()->json(['message' => 'Item deleted successfully']);
    }
}
