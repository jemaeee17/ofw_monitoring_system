<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ApplicantEmployerAssignment;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'ref_code',
        'position',
        'full_name',
        'address',
        'birthdate',
        'place_of_birth',
        'contact_number',
        'email',
        'gender',
        'religion',
        'passport_number',
        'passport_issue_place',
        'passport_expiry',
        'college',
        'highschool',
        'vocational',
        'civil_status',
        'height',
        'weight',
        'deployment_date',
        'application_date',
        'notes',
        'languages',
        'work_history',
        'skills',
        'objective',
        'photo',
        'agency_id',
        'user_id',
    ];

    public function documents()
    {
        return $this->hasMany(ApplicantDocument::class, 'application_id');
    }

    public function flights()
    {
        return $this->hasMany(ApplicantFlight::class, 'application_id');
    }

    public function agency()
    {
        return $this->belongsTo(User::class, 'agency_id');
    }

    public function employer()
    {
        return $this->belongsTo(Employer::class);
    }

    public function assignment()
    {
        return $this->hasOne(ApplicantEmployerAssignment::class, 'applicant_id');
    }
}
