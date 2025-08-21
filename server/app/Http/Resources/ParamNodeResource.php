<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ParamNodeResource extends JsonResource
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
            "param_value" => $this->param_value,
            "param_node_ulid" => $this->param_node_ulid
        ];
    }
}
