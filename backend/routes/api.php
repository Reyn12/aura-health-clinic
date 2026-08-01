<?php

use App\Http\Controllers\Api\V1\Admin\AppointmentController as AdminAppointmentController;
use App\Http\Controllers\Api\V1\Admin\DashboardController;
use App\Http\Controllers\Api\V1\Admin\PatientController as AdminPatientController;
use App\Http\Controllers\Api\V1\Admin\StaffController;
use App\Http\Controllers\Api\V1\AppointmentController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DoctorController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\PatientController;
use App\Http\Controllers\Api\V1\SpecialtyController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes (mounted under /api/v1, see bootstrap/app.php)
|--------------------------------------------------------------------------
*/

// Auth
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/admin/login', [AuthController::class, 'adminLogin']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
});

// Specialties
Route::get('/specialties', [SpecialtyController::class, 'index']);
Route::middleware(['auth:sanctum', 'role:admin,staff'])->group(function () {
    Route::post('/specialties', [SpecialtyController::class, 'store']);
    Route::put('/specialties/{specialty}', [SpecialtyController::class, 'update']);
    Route::delete('/specialties/{specialty}', [SpecialtyController::class, 'destroy']);
});

// Doctors
Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/doctors/{doctor}', [DoctorController::class, 'show']);
Route::get('/doctors/{doctor}/availability', [DoctorController::class, 'availability']);
Route::middleware(['auth:sanctum', 'role:admin,staff'])->group(function () {
    Route::post('/doctors', [DoctorController::class, 'store']);
    Route::put('/doctors/{doctor}', [DoctorController::class, 'update']);
    Route::delete('/doctors/{doctor}', [DoctorController::class, 'destroy']);
    Route::put('/doctors/{doctor}/schedule', [DoctorController::class, 'updateSchedule']);
});

// Appointments (patient / guest)
Route::post('/appointments', [AppointmentController::class, 'store']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::get('/appointments/{appointment}', [AppointmentController::class, 'show']);
    Route::patch('/appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);
    Route::patch('/appointments/{appointment}/reschedule', [AppointmentController::class, 'reschedule']);

    Route::get('/patients/me', [PatientController::class, 'me']);
    Route::put('/patients/me', [PatientController::class, 'updateMe']);
});

// Admin / staff dashboard
Route::middleware(['auth:sanctum', 'role:admin,staff'])->prefix('admin')->group(function () {
    Route::get('/appointments', [AdminAppointmentController::class, 'index']);
    Route::patch('/appointments/{appointment}/status', [AdminAppointmentController::class, 'updateStatus']);

    Route::get('/patients', [AdminPatientController::class, 'index']);
    Route::get('/patients/{email}', [AdminPatientController::class, 'show']);

    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
});

// Admin-only staff account management
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/staff', [StaffController::class, 'index']);
    Route::post('/staff', [StaffController::class, 'store']);
    Route::put('/staff/{staff}', [StaffController::class, 'update']);
    Route::delete('/staff/{staff}', [StaffController::class, 'destroy']);
});

// Notifications
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markRead']);
});
