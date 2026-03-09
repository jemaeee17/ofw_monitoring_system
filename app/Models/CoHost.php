<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Complaint;

class CoHost extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'contact',
    ];

    public function complaints()
    {
        return $this->hasMany(Complaint::class);
    }
}
