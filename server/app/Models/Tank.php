<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tank extends Model
{
    /** @use HasFactory<\Database\Factories\TankFactory> */
    use HasFactory;

    protected $fillable = ["tank_name", "tank_description"];

    public function params()
    {
        return $this->hasMany(Param::class);
    }

    public function users()
    {
        return $this->belongsTo(User::class, 'clerk_id');
    }
}
