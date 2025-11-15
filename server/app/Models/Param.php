<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Param extends Model
{
    /** @use HasFactory<\Database\Factories\ParamFactory> */
    use HasFactory;

    protected $fillable = ["param_name", "param_unit", "tank_id", "clerk_id"];

    protected static function booted()
    {
        static::creating(function ($model) {
            $model->param_ulid = Str::ulid();
        });
    }

    public function param_nodes()
    {
        return $this->hasMany(ParamNodes::class);
    }

    public function tank()
    {
        return $this->belongsTo(Tank::class);
    }

    public function latest_value()
    {
        return $this->hasOne(ParamNodes::class)->latestOfMany()->select('param_value');
    }
}
