<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UrgentComplaint extends Model
{
    use HasFactory;

    protected $table = 'urgent_complaints';

    protected $fillable = [
        'co_host_id',
        'ofw_name',
        'latitude',
        'longitude',
        'city',
        'address',
        'status',
        'agency_id',
    ];

    public function coHost()
    {
        return $this->belongsTo(CoHost::class, 'co_host_id');
    }
}
