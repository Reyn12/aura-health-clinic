<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\AppointmentResource;
use App\Models\Appointment;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    /**
     * Directory of patients derived by grouping appointments by guest email
     * (there is no dedicated patients table for guest bookings yet).
     */
    public function index(Request $request)
    {
        $summaries = $this->buildSummaries();

        if ($request->filled('search')) {
            $search = mb_strtolower($request->string('search'));
            $summaries = $summaries->filter(
                fn ($summary) => str_contains(mb_strtolower($summary['name']), $search)
                    || str_contains(mb_strtolower($summary['email']), $search)
                    || str_contains($summary['phone'], $search)
            )->values();
        }

        return response()->json(['data' => $summaries->values()]);
    }

    public function show(string $email)
    {
        $summary = $this->buildSummaries()->firstWhere('email', $email);

        if (! $summary) {
            abort(404, 'Patient not found.');
        }

        return response()->json(['data' => $summary]);
    }

    /**
     * @return \Illuminate\Support\Collection<int, array<string, mixed>>
     */
    private function buildSummaries()
    {
        $appointments = Appointment::with('doctor.specialty')
            ->orderBy('date')
            ->get();

        $byEmail = collect();

        foreach ($appointments as $appointment) {
            $key = mb_strtolower($appointment->guest_email);
            $resource = (new AppointmentResource($appointment))->resolve();
            $existing = $byEmail->get($key);

            if (! $existing) {
                $byEmail->put($key, [
                    'email' => $appointment->guest_email,
                    'name' => $appointment->guest_name,
                    'phone' => $appointment->guest_phone,
                    'totalAppointments' => 1,
                    'lastVisit' => $resource['date'],
                    'appointments' => [$resource],
                ]);

                continue;
            }

            $existing['totalAppointments'] += 1;
            $existing['appointments'][] = $resource;

            if ($resource['date'] > $existing['lastVisit']) {
                $existing['lastVisit'] = $resource['date'];
                $existing['name'] = $appointment->guest_name;
                $existing['phone'] = $appointment->guest_phone;
            }

            $byEmail->put($key, $existing);
        }

        return $byEmail->values()->sortByDesc('lastVisit')->values();
    }
}
