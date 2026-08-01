<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\AppointmentResource;
use App\Models\Appointment;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AppointmentController extends Controller
{
    /**
     * Book an appointment. Works for guests (no auth) and, if a token is
     * present, links the appointment to the authenticated patient.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'doctorId' => ['required', 'exists:doctors,id'],
            'date' => ['required', 'date'],
            'time' => ['required', 'string'],
            'notes' => ['nullable', 'string'],
            'patientName' => ['required', 'string', 'max:255'],
            'patientPhone' => ['required', 'string', 'max:30'],
            'patientEmail' => ['required', 'string', 'email', 'max:255'],
        ]);

        $doctor = Doctor::findOrFail($data['doctorId']);

        $this->ensureSlotAvailable($doctor->id, $data['date'], $data['time']);

        $appointment = Appointment::create([
            'patient_id' => $request->user()?->id,
            'doctor_id' => $doctor->id,
            'guest_name' => $data['patientName'],
            'guest_email' => $data['patientEmail'],
            'guest_phone' => $data['patientPhone'],
            'notes' => $data['notes'] ?? null,
            'date' => $data['date'],
            'time' => $data['time'],
            'consultation_fee' => $doctor->consultation_fee,
            'status' => 'pending',
        ]);

        return (new AppointmentResource($appointment->load('doctor.specialty')))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * List the authenticated patient's own appointments.
     */
    public function index(Request $request)
    {
        $query = Appointment::with('doctor.specialty')
            ->where('patient_id', $request->user()->id);

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        return AppointmentResource::collection(
            $query->orderByDesc('date')->orderByDesc('time')->paginate(15)
        );
    }

    public function show(Request $request, Appointment $appointment)
    {
        $this->authorizeOwnership($request, $appointment);

        return new AppointmentResource($appointment->load('doctor.specialty'));
    }

    public function cancel(Request $request, Appointment $appointment)
    {
        $this->authorizeOwnership($request, $appointment);

        $appointment->update(['status' => 'cancelled']);

        return new AppointmentResource($appointment->load('doctor.specialty'));
    }

    public function reschedule(Request $request, Appointment $appointment)
    {
        $this->authorizeOwnership($request, $appointment);

        $data = $request->validate([
            'date' => ['required', 'date'],
            'time' => ['required', 'string'],
        ]);

        $this->ensureSlotAvailable($appointment->doctor_id, $data['date'], $data['time'], $appointment->id);

        $appointment->update([
            'date' => $data['date'],
            'time' => $data['time'],
            'status' => 'pending',
        ]);

        return new AppointmentResource($appointment->load('doctor.specialty'));
    }

    private function authorizeOwnership(Request $request, Appointment $appointment): void
    {
        if ($appointment->patient_id !== $request->user()->id) {
            abort(403, 'You do not have permission to access this appointment.');
        }
    }

    private function ensureSlotAvailable(int $doctorId, string $date, string $time, ?int $excludingAppointmentId = null): void
    {
        $query = Appointment::where('doctor_id', $doctorId)
            ->whereDate('date', $date)
            ->where('time', $time)
            ->where('status', '!=', 'cancelled');

        if ($excludingAppointmentId) {
            $query->where('id', '!=', $excludingAppointmentId);
        }

        if ($query->exists()) {
            throw ValidationException::withMessages([
                'time' => ['This time slot is no longer available.'],
            ]);
        }
    }
}
