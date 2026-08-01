<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\PatientProfileResource;
use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    /**
     * Get the authenticated patient's own profile.
     */
    public function me(Request $request)
    {
        return new PatientProfileResource($request->user()->load('patient'));
    }

    /**
     * Update the authenticated patient's own profile.
     */
    public function updateMe(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'dateOfBirth' => ['nullable', 'date'],
            'address' => ['nullable', 'string'],
        ]);

        $user->fill([
            'name' => $data['name'] ?? $user->name,
            'phone' => array_key_exists('phone', $data) ? $data['phone'] : $user->phone,
        ])->save();

        Patient::updateOrCreate(
            ['user_id' => $user->id],
            [
                'date_of_birth' => $data['dateOfBirth'] ?? null,
                'address' => $data['address'] ?? null,
            ]
        );

        return new PatientProfileResource($user->fresh()->load('patient'));
    }
}
