<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TankResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "ulid" => $this->tank_ulid,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
            "name" => $this->tank_name,
            "description" => $this->tank_description,
            "params" => ParamListResource::collection($this->params)
        ];
    }
}
