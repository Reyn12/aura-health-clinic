<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Doctor */
class DoctorResource extends JsonResource
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
            'name' => $this->name,
            'specialtySlug' => $this->specialty?->slug,
            'specialtyName' => $this->specialty?->name,
            'photoUrl' => $this->photo_url,
            'rating' => (float) $this->rating,
            'reviewCount' => $this->review_count,
            'experienceYears' => $this->experience_years,
            'consultationFee' => $this->consultation_fee,
            'schedule' => [
                ['day' => $this->day_label, 'hours' => $this->hours_label],
            ],
            'bio' => $this->bio,
        ];
    }
}
