<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ItemShareController extends Controller
{
    /**
     * Update sharing permission for a user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Item  $item
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Item $item, User $user)
    {
        if (Auth::id() !== $item->owner_id) {
            return response()->json(['message' => 'Only the owner can change permissions.'], 403);
        }

        $validated = $request->validate([
            'permission' => ['required', Rule::in(['viewer', 'editor'])],
        ]);

        $item->sharedWithUsers()->updateExistingPivot($user->id, ['permission' => $validated['permission']]);

        return response()->json(['message' => "Permission for {$user->name} updated to {$validated['permission']}."], 200);
    }

    /**
     * Get the list of users the item is shared with.
     *
     * @param  \App\Models\Item  $item
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Item $item)
    {
        if (Auth::id() !== $item->owner_id) {
            return response()->json(['message' => 'Only the owner can view shared users.'], 403);
        }

        $sharedUsers = $item->sharedWithUsers()->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'permission' => $user->pivot->permission,
            ];
        });

        return response()->json($sharedUsers, 200);
    }

    /**
     * Share an item with another user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Item  $item
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, Item $item)
    {
        if (Auth::id() !== $item->owner_id) {
            return response()->json(['message' => 'Only the owner can share this item.'], 403);
        }

        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
            'permission' => ['required', Rule::in(['viewer', 'editor'])],
        ]);

        $userToShareWith = User::where('email', $validated['email'])->first();

        if ($userToShareWith->id === $item->owner_id) {
            return response()->json(['message' => 'You cannot share an item with yourself.'], 422);
        }

        $item->sharedWithUsers()->syncWithoutDetaching([
            $userToShareWith->id => ['permission' => $validated['permission']]
        ]);

        if (method_exists($item, 'children')) {
            $children = $item->children;
            foreach ($children as $child) {
                $child->sharedWithUsers()->syncWithoutDetaching([
                    $userToShareWith->id => ['permission' => $validated['permission']]
                ]);
            }
        }

        return response()->json(['message' => "Item successfully shared with {$userToShareWith->name} and its children (if any)."], 200);
    }

    /**
     * Revoke sharing access from a user.
     *
     * @param  \App\Models\Item  $item
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Item $item, User $user)
    {
        if (Auth::id() !== $item->owner_id) {
            return response()->json(['message' => 'Only the owner can revoke access.'], 403);
        }

        if ($item->sharedWithUsers()->detach($user->id)) {
            return response()->json(['message' => "Access for {$user->name} has been revoked."], 200);
        }

        return response()->json(['message' => "This user does not have access to the item."], 404);
    }
}
