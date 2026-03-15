<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Complaint;
use App\Models\User;

class CoHost extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'contact',
        'agency_id',
    ];

    public function agency()
    {
        return $this->belongsTo(User::class, 'agency_id');
    }

    public function complaints()
    {
        return $this->hasMany(Complaint::class);
    }
}
