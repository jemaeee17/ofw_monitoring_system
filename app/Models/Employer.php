<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\ApplicantEmployerAssignment;

class Employer extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_name',
        'business_type',
        'industry_sector',
        'position',
        'cr_number',
        'email',
        'website',
        'regional_office_address',
        'poc_name',
        'poc_contact_number',
    ];

    public function assignedApplicants()
    {
        return $this->hasMany(ApplicantEmployerAssignment::class, 'employer_id');
    }
}
