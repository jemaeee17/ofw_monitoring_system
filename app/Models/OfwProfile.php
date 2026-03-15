<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OfwProfile extends Model
{
    use HasFactory;

    protected $table = 'ofw_profiles';

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'address',
        'birthdate',
        'phone',
        'gender',
        'photo',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}