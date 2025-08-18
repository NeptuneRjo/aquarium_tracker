<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tank extends Model
{
    /** @use HasFactory<\Database\Factories\TankFactory> */
    use HasFactory;

    protected $fillable = ["tank_name", "tank_description"];
    protected $primaryKey = 'tank_ulid';

    public function params()
    {
        return $this->hasMany(Param::class);
    }
}
