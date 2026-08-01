<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class StaffController extends Controller
{
    /**
     * List staff/admin accounts.
     */
    public function index()
    {
        $staff = User::whereIn('role', ['admin', 'staff'])->orderBy('name')->get();

        return UserResource::collection($staff);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:30'],
            'password' => ['required', 'confirmed', 'min:8'],
            'role' => ['required', Rule::in(['admin', 'staff'])],
        ]);

        $staff = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
        ]);

        return (new UserResource($staff))->response()->setStatusCode(201);
    }

    public function update(Request $request, User $staff)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', 'unique:users,email,'.$staff->id],
            'phone' => ['nullable', 'string', 'max:30'],
            'password' => ['nullable', 'confirmed', 'min:8'],
            'role' => ['sometimes', 'required', Rule::in(['admin', 'staff'])],
        ]);

        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $staff->update($data);

        return new UserResource($staff);
    }

    public function destroy(User $staff)
    {
        $staff->delete();

        return response()->json(['message' => 'Staff account deleted.']);
    }
}
