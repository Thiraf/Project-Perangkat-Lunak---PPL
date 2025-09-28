<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Label;

class LabelController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $labels = Label::where('user_id', $user->id)->get(['id', 'name', 'color']);
        return response()->json($labels);
    }
}
