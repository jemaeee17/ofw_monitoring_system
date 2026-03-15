<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ApplicationController;
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
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\OfwProfileController;
use App\Http\Controllers\MessageController;


Route::post('/agency/login', [AuthController::class, 'agencyLogin']);
Route::post('/admin/login', [AuthController::class, 'adminLogin']);
Route::post('/ofw/login', [AuthController::class, 'ofwLogin']);
Route::middleware('auth:sanctum')->post('/ofw/logout', [AuthController::class, 'ofwLogout']);

Route::post('/register', [RegisterController::class, 'register']);

Route::post('/appointments', [AppointmentController::class, 'store']);
Route::get('/appointments/fully-booked', [AppointmentController::class, 'fullyBookedDates']);
Route::get('/appointments/booked-times/{date}', [AppointmentController::class, 'bookedTimes']);

Route::post('/send-emergency-code', [EmergencyController::class, 'sendCode']);
Route::post('/verify-emergency-code', [EmergencyController::class, 'verifyCode']);

Route::post('/complaints', [ComplaintController::class, 'store']);
Route::get('/public/agencies', [UserController::class, 'getAgenciesPublic']);

Route::get('/public/co-hosts', [CoHostController::class, 'publicIndex']);
Route::get('/ofw/deployment-status/{email}', [ApplicationController::class, 'deploymentStatus']);


Route::middleware('auth:sanctum')->group(function () {

    Route::get('/agency/profile', function (Request $request) {
        return $request->user();
    });


    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::post('/applications', [ApplicationController::class, 'store']);

    Route::post('/applications/{id}/set-employed', [ApplicationController::class, 'setEmployed']);
    Route::post('/applications/{id}/set-deployed', [ApplicationController::class, 'setDeployed']);

    Route::get('/employed', [ApplicationController::class, 'getEmployed']);
    Route::get('/deployed', [ApplicationController::class, 'deployed']);

    Route::post('/update-registry', [ApplicationController::class, 'updateRegistry']);

    Route::get('/agency/dashboard-stats', [ApplicationController::class, 'dashboardStats']);
    Route::get('/agency/dashboard-activities', [ApplicationController::class, 'dashboardActivities']);
    Route::get('/agency/monthly-appointments', [AppointmentController::class, 'monthlyAppointments']);


    Route::post('/employers', [EmployerController::class, 'store']);
    Route::get('/employers', [EmployerController::class, 'index']);


    Route::get('/assignments', [ApplicantEmployerAssignmentController::class, 'index']);
    Route::post('/assign-employer', [ApplicantEmployerAssignmentController::class, 'store']);

    Route::prefix('applications/{applicationId}')->group(function () {
        Route::get('/', [ApplicantDetailsController::class, 'show']);
        Route::post('/details', [ApplicantDetailsController::class, 'store']);
    });

    Route::apiResource('co-hosts', CoHostController::class);

    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::post('/appointments/{id}/update-status', [AppointmentController::class, 'updateAppointmentStatus']);


    Route::get('/activities', [NotificationController::class, 'getActivities']);
    Route::get('/notifications', [NotificationController::class, 'getNotifications']);

    Route::post('/notifications/read/{id}', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/{id}/mark-read', [NotificationController::class, 'markAsRead']);

    Route::get('/messages/agency-appointments', [NotificationController::class, 'agencyAppointmentMessages']);
    Route::get('/messages/urgent', [NotificationController::class, 'agencyUrgentMessages']);
    Route::get('/messages/normal', [NotificationController::class, 'agencyNormalMessages']);


    Route::get('/complaints', [ComplaintController::class, 'index']);
    Route::get('/complaints/archived', [ComplaintController::class, 'archived']);

    Route::patch('/complaints/{id}/done', [ComplaintController::class, 'markAsDone']);


    Route::get('/complaints/urgent', [UrgentComplaintController::class, 'index']);
    Route::get('/complaints/urgent/archived', [UrgentComplaintController::class, 'archived']);
    Route::get('/complaints/urgent/{id}', [UrgentComplaintController::class, 'show']);
    Route::post('/complaints/urgent', [UrgentComplaintController::class, 'store']);
    Route::patch('/complaints/urgent/{id}/done', [UrgentComplaintController::class, 'markAsDone']);


    Route::get('/agencies', [UserController::class, 'getAgencies']);
    Route::get('/agencies/{id}', [UserController::class, 'getAgency']);
    Route::post('/agencies', [UserController::class, 'registerAgency']);

    Route::patch('/agencies/{id}/block', [UserController::class, 'blockAgency']);
    Route::patch('/agencies/{id}/reactivate', [UserController::class, 'reactivateAgency']);

    Route::get('/blocked-agencies', [UserController::class, 'blockedCount']);


    Route::get('/total-agencies', [UserController::class, 'getTotalAgencies']);
    Route::get('/active-agencies', [UserController::class, 'getActiveAgencies']);
    Route::get('/total-ofws', [UserController::class, 'getTotalOfws']);

    Route::get('/complaints/monthly-normal', [ComplaintController::class, 'getMonthlyNormalComplaints']);
    Route::get('/complaints/monthly-urgent', [UrgentComplaintController::class, 'getMonthlyUrgentComplaints']);

    Route::get('/complaints/today-normal', [ComplaintController::class, 'getTodayNormalComplaints']);
    Route::get('/complaints/today-urgent', [UrgentComplaintController::class, 'getTodayUrgentComplaints']);


    Route::put('/agency/settings/{id}', [UserController::class, 'updateAgencySettings']);

    Route::get('/ofw/profile', [OfwProfileController::class, 'show']);
    Route::put('/ofw/profile', [OfwProfileController::class, 'update']);

    Route::get('/messages/conversation/{id}', [MessageController::class, 'getConversation']);
    Route::get('/ofw/messages/conversation/{id}', [MessageController::class, 'ofwConversation']);
    Route::post('/messages/reply', [MessageController::class, 'reply']);

});