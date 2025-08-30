<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ParamListResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
            "name" => $this->param_name,
            "unit" => $this->param_unit,
            "ulid" => $this->param_ulid,
            "latest_value" => $this->latest_value->param_value ?? 0.0
        ];
    }
}
