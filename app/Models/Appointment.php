<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'address',
        'city',
        'contact_person',
        'phone',
        'status',
        'business_type',
        'schedule_date',
        'schedule_time',
        'agency_id',
    ];

    public function agency()
    {
        return $this->belongsTo(User::class, 'agency_id');
    }
}
