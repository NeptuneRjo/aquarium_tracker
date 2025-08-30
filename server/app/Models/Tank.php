<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Tank extends Model
{
    /** @use HasFactory<\Database\Factories\TankFactory> */
    use HasFactory;

    protected $fillable = ["tank_name", "tank_description", "clerk_id"];

    protected static function booted()
    {
        static::creating(function ($model) {
            $model->tank_ulid = Str::ulid();
        });
    }

    public function params()
    {
        return $this->hasMany(Param::class);
    }
}
