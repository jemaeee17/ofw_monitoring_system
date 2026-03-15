<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ApplicantEmployerAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'applicant_id',
        'employer_id',
        'job_title',
        'salary',
        'agency_id',
    ];

    // Relationships
    public function applicant()
    {
        return $this->belongsTo(Application::class, 'applicant_id');
    }

    public function employer()
    {
        return $this->belongsTo(Employer::class, 'employer_id');
    }

    public function agency()
    {
        return $this->belongsTo(User::class, 'agency_id');
    }

}
