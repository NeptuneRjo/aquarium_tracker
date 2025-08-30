<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ParamNodes extends Model
{
    /** @use HasFactory<\Database\Factories\ParamNodesFactory> */
    use HasFactory;

    protected $fillable = ["param_id", "param_value", "clerk_id"];

    protected static function booted()
    {
        static::creating(function ($model) {
            $model->param_node_ulid = Str::ulid();
        });
    }

    public function params()
    {
        return $this->belongsTo(Param::class);
    }
}
