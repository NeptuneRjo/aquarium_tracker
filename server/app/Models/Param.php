<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Param extends Model
{
    /** @use HasFactory<\Database\Factories\ParamFactory> */
    use HasFactory;

    protected $fillable = ["param_name", "param_unit"];

    public function param_nodes()
    {
        return $this->hasMany(ParamNodes::class);
    }

    public function tanks()
    {
        return $this->belongsTo(Tank::class);
    }
}
