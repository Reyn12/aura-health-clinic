<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\SpecialtyResource;
use App\Models\Specialty;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SpecialtyController extends Controller
{
    /**
     * Public list of all specialties.
     */
    public function index()
    {
        return SpecialtyResource::collection(Specialty::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:specialties,slug'],
            'description' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:100'],
        ]);

        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        $specialty = Specialty::create($data);

        return (new SpecialtyResource($specialty))->response()->setStatusCode(201);
    }

    public function update(Request $request, Specialty $specialty)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'required', 'string', 'max:255', 'unique:specialties,slug,'.$specialty->id],
            'description' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:100'],
        ]);

        $specialty->update($data);

        return new SpecialtyResource($specialty);
    }

    public function destroy(Specialty $specialty)
    {
        $specialty->delete();

        return response()->json(['message' => 'Specialty deleted.']);
    }
}
