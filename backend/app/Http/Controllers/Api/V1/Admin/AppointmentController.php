<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\AppointmentResource;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AppointmentController extends Controller
{
    /**
     * List all appointments, filterable by doctor/date/status/patient (email).
     */
    public function index(Request $request)
    {
        $query = Appointment::with('doctor.specialty');

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('doctorId')) {
            $query->where('doctor_id', $request->integer('doctorId'));
        }

        if ($request->filled('date')) {
            $query->whereDate('date', $request->string('date'));
        }

        if ($request->filled('patientEmail')) {
            $query->where('guest_email', $request->string('patientEmail'));
        }

        $appointments = $query->orderByDesc('date')->orderByDesc('time')->get();

        return AppointmentResource::collection($appointments);
    }

    public function updateStatus(Request $request, Appointment $appointment)
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['pending', 'confirmed', 'completed', 'cancelled'])],
        ]);

        $appointment->update(['status' => $data['status']]);

        return new AppointmentResource($appointment->load('doctor.specialty'));
    }
}
