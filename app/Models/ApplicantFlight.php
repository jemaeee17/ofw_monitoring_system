<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplicantFlight extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_id',
        'agency',
        'file_path',
        'contact_name',
        'contact_number'
    ];

    public function application()
    {
        return $this->belongsTo(Application::class, 'application_id');
    }
}