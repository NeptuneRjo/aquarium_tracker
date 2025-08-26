<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ParamResource extends JsonResource
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
            "values" => ParamNodeResource::collection($this->param_nodes)
        ];
    }
}
