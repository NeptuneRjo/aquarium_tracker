<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TankListResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "tank_ulid" => $this->tank_ulid,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
            "tank_name" => $this->tank_name,
            "tank_description" => $this->tank_description,
        ];
    }
}
