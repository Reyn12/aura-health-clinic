<?php

namespace Database\Seeders;

use App\Models\Doctor;
use App\Models\Specialty;
use Illuminate\Database\Seeder;

class DoctorSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $doctors = [
            [
                'key' => 'dr-emily-chen',
                'name' => 'Dr. Emily Chen',
                'specialtySlug' => 'general-practice',
                'photo_url' => 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&q=80',
                'rating' => 4.9,
                'review_count' => 120,
                'experience_years' => 8,
                'consultation_fee' => 150000,
                'day_label' => 'Mon - Fri',
                'hours_label' => '09:00 - 17:00',
                'bio' => 'Dr. Emily focuses on preventive care and everyday health concerns for the whole family.',
            ],
            [
                'key' => 'dr-james-wilson',
                'name' => 'Dr. James Wilson',
                'specialtySlug' => 'dentistry',
                'photo_url' => 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&q=80',
                'rating' => 4.8,
                'review_count' => 85,
                'experience_years' => 10,
                'consultation_fee' => 200000,
                'day_label' => 'Tue - Sat',
                'hours_label' => '10:00 - 18:00',
                'bio' => 'Dr. James specializes in restorative and cosmetic dentistry with a gentle approach.',
            ],
            [
                'key' => 'dr-sarah-patel',
                'name' => 'Dr. Sarah Patel',
                'specialtySlug' => 'cardiology',
                'photo_url' => 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&q=80',
                'rating' => 5.0,
                'review_count' => 204,
                'experience_years' => 14,
                'consultation_fee' => 350000,
                'day_label' => 'Mon, Wed, Fri',
                'hours_label' => '08:00 - 14:00',
                'bio' => 'Dr. Sarah is a board-certified cardiologist dedicated to keeping your heart healthy.',
            ],
            [
                'key' => 'dr-michael-tan',
                'name' => 'Dr. Michael Tan',
                'specialtySlug' => 'optometry',
                'photo_url' => 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&q=80',
                'rating' => 4.7,
                'review_count' => 63,
                'experience_years' => 6,
                'consultation_fee' => 180000,
                'day_label' => 'Mon - Sat',
                'hours_label' => '09:00 - 16:00',
                'bio' => 'Dr. Michael provides comprehensive eye exams and vision correction plans.',
            ],
            [
                'key' => 'dr-olivia-bennett',
                'name' => 'Dr. Olivia Bennett',
                'specialtySlug' => 'psychiatry',
                'photo_url' => 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&q=80',
                'rating' => 4.9,
                'review_count' => 97,
                'experience_years' => 11,
                'consultation_fee' => 300000,
                'day_label' => 'Mon - Fri',
                'hours_label' => '11:00 - 19:00',
                'bio' => 'Dr. Olivia helps patients navigate mental health with compassionate, evidence-based care.',
            ],
            [
                'key' => 'dr-daniel-roberts',
                'name' => 'Dr. Daniel Roberts',
                'specialtySlug' => 'pediatrics',
                'photo_url' => 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&q=80',
                'rating' => 4.8,
                'review_count' => 141,
                'experience_years' => 9,
                'consultation_fee' => 175000,
                'day_label' => 'Mon - Sat',
                'hours_label' => '08:00 - 15:00',
                'bio' => 'Dr. Daniel provides friendly, thorough care for infants, children, and teens.',
            ],
        ];

        foreach ($doctors as $doctor) {
            $specialty = Specialty::where('slug', $doctor['specialtySlug'])->firstOrFail();

            Doctor::updateOrCreate(
                ['name' => $doctor['name']],
                [
                    'specialty_id' => $specialty->id,
                    'photo_url' => $doctor['photo_url'],
                    'rating' => $doctor['rating'],
                    'review_count' => $doctor['review_count'],
                    'experience_years' => $doctor['experience_years'],
                    'consultation_fee' => $doctor['consultation_fee'],
                    'day_label' => $doctor['day_label'],
                    'hours_label' => $doctor['hours_label'],
                    'bio' => $doctor['bio'],
                ]
            );
        }
    }
}
