<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Label;
use Illuminate\Validation\Rule;

class LabelController extends Controller
{
    public function index()
    {
        $labels = Label::get(['id', 'name', 'color']);
        return response()->json($labels);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:labels'],
            'color' => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
        ]);

        $label = Label::create($validated);
        return response()->json($label, 201);
    }

    public function update(Request $request, Label $label)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('labels')->ignore($label->id)],
            'color' => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
        ]);

        $label->update($validated);
        return response()->json($label);
    }

    public function destroy(Label $label)
    {
        $label->delete();
        return response()->json(null, 204);
    }
}
