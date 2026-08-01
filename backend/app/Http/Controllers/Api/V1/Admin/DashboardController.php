<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Doctor;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    /**
     * Aggregate stats for the admin/staff overview page.
     */
    public function stats()
    {
        $today = Carbon::today();

        $totalAppointments = Appointment::count();
        $todayAppointments = Appointment::whereDate('date', $today)->count();
        $pendingAppointments = Appointment::where('status', 'pending')->count();
        $totalDoctors = Doctor::count();
        $totalPatients = Appointment::distinct('guest_email')->count('guest_email');
        $totalRevenue = (int) Appointment::where('status', 'completed')->sum('consultation_fee');

        return response()->json([
            'data' => [
                'totalAppointments' => $totalAppointments,
                'todayAppointments' => $todayAppointments,
                'pendingAppointments' => $pendingAppointments,
                'totalDoctors' => $totalDoctors,
                'totalPatients' => $totalPatients,
                'totalRevenue' => $totalRevenue,
            ],
        ]);
    }
}
