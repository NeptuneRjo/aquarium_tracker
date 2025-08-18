<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParamNodes extends Model
{
    /** @use HasFactory<\Database\Factories\ParamNodesFactory> */
    use HasFactory;

    protected $fillable = ['param_value'];
    protected $primaryKey = "param_node_ulid";

    public function params()
    {
        return $this->belongsTo(Param::class);
    }
}
