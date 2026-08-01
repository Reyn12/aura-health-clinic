<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Appointment */
class AppointmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'patientName' => $this->guest_name,
            'patientPhone' => $this->guest_phone,
            'patientEmail' => $this->guest_email,
            'patientNotes' => $this->notes ?? '',
            'doctorId' => (string) $this->doctor_id,
            'doctorName' => $this->doctor?->name,
            'doctorPhotoUrl' => $this->doctor?->photo_url,
            'specialtyName' => $this->doctor?->specialty?->name,
            'date' => $this->date?->format('Y-m-d'),
            'time' => $this->time,
            'consultationFee' => $this->consultation_fee,
            'status' => $this->status,
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
