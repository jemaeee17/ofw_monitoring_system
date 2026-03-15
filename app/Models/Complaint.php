<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\CoHost;

class Complaint extends Model
{
    use HasFactory;
    protected $fillable = [
        'co_host_id',
        'ofw_name',
        'gender',
        'birthdate',
        'occupation',
        'national_id',
        'passport_no',
        'email',
        'contact_person',
        'primary_contact',
        'secondary_contact',
        'address_abroad',
        'complaint',
        'image1',
        'image2',
        'image3',
        'status',
        'agency_id',
    ];

    public function coHost()
    {
        return $this->belongsTo(CoHost::class);
    }
}
