<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ApplicationController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\API\EmployerController;
use App\Http\Controllers\API\ApplicantEmployerAssignmentController;
use App\Http\Controllers\API\ApplicantDetailsController;
use App\Http\Controllers\API\CoHostController;
use App\Http\Controllers\API\AppointmentController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\API\EmergencyController;
use App\Http\Controllers\API\ComplaintController;
use App\Http\Controllers\API\UrgentComplaintController;
use App\Http\Controllers\API\UserController;

Route::post('/agency/login', [AuthController::class, 'agencyLogin']);
Route::post('/admin/login', [AuthController::class, 'adminLogin']);
Route::post('/ofw/login', [AuthController::class, 'ofwLogin']);
Route::post('/applications', [ApplicationController::class, 'store']);
Route::get('/applications', [ApplicationController::class, 'index']);
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/employers', [EmployerController::class, 'store']);
Route::get('/employers', [EmployerController::class, 'index']);
Route::get('/assignments', [ApplicantEmployerAssignmentController::class, 'index']);
Route::post('/assignments', [ApplicantEmployerAssignmentController::class, 'store']);
Route::post('/assign-employer', [ApplicantEmployerAssignmentController::class, 'store']);

Route::prefix('applications/{applicationId}')->group(function () {
    Route::get('/', [ApplicantDetailsController::class, 'show']);
    Route::post('/details', [ApplicantDetailsController::class, 'store']);
});

Route::apiResource('co-hosts', CoHostController::class);

Route::post('/appointments', [AppointmentController::class, 'store']);
Route::get('/appointments', [AppointmentController::class, 'index']);
Route::get('/appointments/fully-booked', [AppointmentController::class, 'fullyBookedDates']);
Route::get('/appointments/booked-times/{date}', [AppointmentController::class, 'bookedTimes']);

Route::post('/notifications/read/{id}', [NotificationController::class, 'markAsRead']);
Route::post('/notifications/{id}/mark-read', [NotificationController::class, 'markAsRead']);
Route::get('/activities', [NotificationController::class, 'getActivities']);
Route::get('/notifications/{user_id}', [NotificationController::class, 'getNotifications']);

Route::post('/send-emergency-code', [EmergencyController::class, 'sendCode']);
Route::post('/verify-emergency-code', [EmergencyController::class, 'verifyCode']);
Route::get('/agencies', [ComplaintController::class, 'agencies']);
Route::post('/complaints', [ComplaintController::class, 'store']);

Route::get('/complaints/urgent/{id}', [UrgentComplaintController::class, 'show']);
Route::get('/complaints', [ComplaintController::class, 'index']);

Route::post('/applications/{id}/set-employed', [ApplicationController::class, 'setEmployed']);
Route::get('/employed', [ApplicationController::class, 'getEmployed']);
Route::post('/applications/{id}/set-deployed', [ApplicationController::class, 'setDeployed']);
Route::get('/deployed', [ApplicationController::class, 'deployed']);
Route::post('/appointments/{id}/update-status', [AppointmentController::class, 'updateAppointmentStatus']);

Route::get('/agencies', [UserController::class, 'getAgencies']);
Route::get('/agencies/{id}', [UserController::class, 'getAgency']);
Route::post('/agencies', [UserController::class, 'registerAgency']);

Route::get('/complaints/urgent/archived', [UrgentComplaintController::class, 'archived']);
Route::get('/complaints/urgent', [UrgentComplaintController::class, 'index']);
Route::get('/complaints/urgent/{id}', [UrgentComplaintController::class, 'show'])->where('id', '[0-9]+'); // numeric only
Route::post('/complaints/urgent', [UrgentComplaintController::class, 'store']);
Route::patch('/complaints/urgent/{id}/done', [UrgentComplaintController::class, 'markAsDone'])->where('id', '[0-9]+');
Route::patch('/complaints/{id}/done', [ComplaintController::class, 'markAsDone'])->where('id', '[0-9]+');
Route::get('/complaints/archived', [ComplaintController::class, 'archived']);
Route::post('/update-registry', [ApplicationController::class, 'updateRegistry']);
Route::get('/total-agencies', [UserController::class, 'getTotalAgencies']);
Route::get('/active-agencies', [UserController::class, 'getActiveAgencies']);
Route::get('/total-ofws', [UserController::class, 'getTotalOfws']);
Route::get('/complaints/monthly-normal', [ComplaintController::class, 'getMonthlyNormalComplaints']);
Route::get('/complaints/monthly-urgent', [UrgentComplaintController::class, 'getMonthlyUrgentComplaints']);
Route::get('/complaints/today-normal', [ComplaintController::class, 'getTodayNormalComplaints']);
Route::get('/complaints/today-urgent', [UrgentComplaintController::class, 'getTodayUrgentComplaints']);
Route::patch('/agencies/{id}/block', [UserController::class, 'blockAgency']);
Route::patch('/agencies/{id}/reactivate', action: [UserController::class, 'reactivateAgency']);
Route::get('/blocked-agencies', [UserController::class, 'blockedCount']);
Route::get('/agency/dashboard-stats', [ApplicationController::class, 'dashboardStats']);
Route::get('/agency/monthly-appointments', [AppointmentController::class, 'monthlyAppointments']);
Route::get('/agency/dashboard-activities', [ApplicationController::class, 'dashboardActivities']);
Route::get('/messages/agency-appointments', [NotificationController::class, 'agencyAppointmentMessages']);
Route::get('/messages/urgent', [NotificationController::class, 'agencyUrgentMessages']);
Route::get('/messages/normal', [NotificationController::class, 'agencyNormalMessages']);
Route::put('/agency/settings/{id}', [UserController::class, 'updateAgencySettings']);
Route::get('/ofw/profile/{id}', [ApplicationController::class, 'getProfile']);
Route::put('/ofw/profile/{id}', [ApplicationController::class, 'updateProfile']);
