<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\DoctorResource;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Specialty;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    /**
     * Fixed daily slot grid, matching the clinic's standard booking windows
     * (mirrors the frontend's former `data/time-slots.ts` mock).
     */
    private const TIME_SLOTS = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
    ];

    public function index(Request $request)
    {
        $query = Doctor::with('specialty');

        if ($request->filled('specialty')) {
            $query->whereHas('specialty', function ($q) use ($request) {
                $q->where('slug', $request->string('specialty'));
            });
        }

        return DoctorResource::collection($query->orderBy('name')->get());
    }

    public function show(Doctor $doctor)
    {
        return new DoctorResource($doctor->load('specialty'));
    }

    public function availability(Request $request, Doctor $doctor)
    {
        $data = $request->validate([
            'date' => ['required', 'date'],
        ]);

        $bookedTimes = Appointment::where('doctor_id', $doctor->id)
            ->whereDate('date', $data['date'])
            ->where('status', '!=', 'cancelled')
            ->pluck('time')
            ->map(fn ($time) => substr($time, 0, 5))
            ->all();

        $slots = collect(self::TIME_SLOTS)->map(fn ($time) => [
            'time' => $time,
            'available' => ! in_array($time, $bookedTimes, true),
        ]);

        return response()->json(['data' => $slots]);
    }

    public function store(Request $request)
    {
        $doctor = Doctor::create($this->validatedDoctorData($request));

        return (new DoctorResource($doctor->load('specialty')))->response()->setStatusCode(201);
    }

    public function update(Request $request, Doctor $doctor)
    {
        $doctor->update($this->validatedDoctorData($request, $doctor));

        return new DoctorResource($doctor->load('specialty'));
    }

    public function destroy(Doctor $doctor)
    {
        $doctor->delete();

        return response()->json(['message' => 'Doctor deleted.']);
    }

    public function updateSchedule(Request $request, Doctor $doctor)
    {
        $data = $request->validate([
            'day' => ['required', 'string', 'max:255'],
            'hours' => ['required', 'string', 'max:255'],
        ]);

        $doctor->update([
            'day_label' => $data['day'],
            'hours_label' => $data['hours'],
        ]);

        return new DoctorResource($doctor->load('specialty'));
    }

    /**
     * @return array<string, mixed>
     */
    private function validatedDoctorData(Request $request, ?Doctor $doctor = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'specialtySlug' => ['required', 'string', 'exists:specialties,slug'],
            'photoUrl' => ['nullable', 'string', 'max:2048'],
            'experienceYears' => ['required', 'integer', 'min:0'],
            'consultationFee' => ['required', 'integer', 'min:0'],
            'bio' => ['nullable', 'string'],
            'schedule' => ['required', 'array', 'min:1'],
            'schedule.0.day' => ['required', 'string', 'max:255'],
            'schedule.0.hours' => ['required', 'string', 'max:255'],
        ]);

        $specialty = Specialty::where('slug', $data['specialtySlug'])->firstOrFail();

        return [
            'name' => $data['name'],
            'specialty_id' => $specialty->id,
            'photo_url' => $data['photoUrl'] ?? null,
            'experience_years' => $data['experienceYears'],
            'consultation_fee' => $data['consultationFee'],
            'day_label' => $data['schedule'][0]['day'],
            'hours_label' => $data['schedule'][0]['hours'],
            'bio' => $data['bio'] ?? null,
            'rating' => $doctor->rating ?? 5.0,
            'review_count' => $doctor->review_count ?? 0,
        ];
    }
}
