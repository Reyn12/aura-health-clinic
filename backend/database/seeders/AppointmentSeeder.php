<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Doctor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class AppointmentSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $appointments = [
            ['patientName' => 'Emma Morrison', 'patientPhone' => '0812 1111 2222', 'patientEmail' => 'emma.morrison@email.com', 'doctorName' => 'Dr. Sarah Patel', 'dateOffset' => 0, 'time' => '09:00', 'status' => 'confirmed', 'notes' => 'Follow-up for blood pressure check.'],
            ['patientName' => 'Robert Johnson', 'patientPhone' => '0812 3333 4444', 'patientEmail' => 'robert.johnson@email.com', 'doctorName' => 'Dr. Emily Chen', 'dateOffset' => 0, 'time' => '09:30', 'status' => 'pending', 'notes' => null],
            ['patientName' => 'Alice Kruger', 'patientPhone' => '0812 5555 6666', 'patientEmail' => 'alice.kruger@email.com', 'doctorName' => 'Dr. James Wilson', 'dateOffset' => 0, 'time' => '10:15', 'status' => 'pending', 'notes' => null],
            ['patientName' => 'Michael Tanaka', 'patientPhone' => '0812 7777 8888', 'patientEmail' => 'michael.tanaka@email.com', 'doctorName' => 'Dr. Michael Tan', 'dateOffset' => -1, 'time' => '14:00', 'status' => 'completed', 'notes' => null],
            ['patientName' => 'Olivia Santos', 'patientPhone' => '0812 9999 0000', 'patientEmail' => 'olivia.santos@email.com', 'doctorName' => 'Dr. Olivia Bennett', 'dateOffset' => -2, 'time' => '11:00', 'status' => 'completed', 'notes' => null],
            ['patientName' => 'Daniel Wirawan', 'patientPhone' => '0812 1212 3434', 'patientEmail' => 'daniel.wirawan@email.com', 'doctorName' => 'Dr. Daniel Roberts', 'dateOffset' => -3, 'time' => '08:30', 'status' => 'cancelled', 'notes' => null],
            ['patientName' => 'Siti Rahma', 'patientPhone' => '0812 4545 6767', 'patientEmail' => 'siti.rahma@email.com', 'doctorName' => 'Dr. Sarah Patel', 'dateOffset' => 2, 'time' => '13:00', 'status' => 'confirmed', 'notes' => null],
        ];

        foreach ($appointments as $appointment) {
            $doctor = Doctor::where('name', $appointment['doctorName'])->firstOrFail();

            Appointment::updateOrCreate(
                [
                    'guest_email' => $appointment['patientEmail'],
                    'doctor_id' => $doctor->id,
                    'time' => $appointment['time'],
                ],
                [
                    'guest_name' => $appointment['patientName'],
                    'guest_phone' => $appointment['patientPhone'],
                    'notes' => $appointment['notes'],
                    'date' => Carbon::today()->addDays($appointment['dateOffset']),
                    'consultation_fee' => $doctor->consultation_fee,
                    'status' => $appointment['status'],
                ]
            );
        }
    }
}
