<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Resources\TankListResource;
use App\Http\Resources\TankResource;
use Illuminate\Http\Request;
use App\Models\Tank;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class TankController extends Controller
{
    public function index(Request $request)
    {
        try {
            $clerk_id = $request->header('Clerk-Id');
            $tanks = Tank::where('clerk_id', $clerk_id)
                ->orderBy('updated_at', 'desc')->get();

            return ApiResponse::response(TankListResource::collection($tanks));
        } catch (Exception $e) {
            return ApiResponse::response([], 400, $e->getMessage());
        }
    }

    public function show(Request $request)
    {
        try {
            $clerk_id = $request->header('Clerk-Id');
            $tank = Tank::where('clerk_id', $clerk_id)
                ->where('tank_ulid', $request->tank_ulid)
                ->firstOrFail();

            return ApiResponse::response(TankResource::make($tank));
        } catch (ModelNotFoundException $e) {
            $message = "No tank found with that ULID.";
            return ApiResponse::response([], 404, $message);
        } catch (Exception $e) {
            return ApiResponse::response([], 404, $e->getMessage());
        }
    }

    private function create_defaults(string|array|null $clerk_id)
    {
        $default_values = [
            ["Alkalinity", "dKH"],
            ["Salinity", "PPT"],
            ["Nitrate", "PPM"],
            ["Nitrite", "PPM"],
            ["Calcium", "PPM"],
            ["Magnesium", "PPM"],
            ["Phosphate", "PPM"],
            ["pH", "pH"]
        ];

        $default_params = [];

        foreach ($default_values as $values) {
            $default_params[] = [
                "param_name" => $values[0],
                "param_unit" => $values[1],
                "clerk_id" => $clerk_id
            ];
        }

        return $default_params;
    }

    public function store(Request $request)
    {
        try {
            $clerk_id = $request->header('Clerk-Id');
            $validated = $request->validate([
                'name' => 'required|max:64',
                'description' => 'max:256',
            ]);

            $tank = Tank::create([
                'tank_name' => $validated['name'],
                'tank_description' => $validated['description'],
                'clerk_id' => $clerk_id
            ]);

            $tank->params()->createMany($this->create_defaults($clerk_id));

            return ApiResponse::response(TankResource::make($tank));
        } catch (Exception $e) {
            return ApiResponse::response([], 400, $e->getMessage());
            // return response()->json([$e->getMessage()], 400);
        }
    }

    public function edit(Request $request)
    {
        try {
            $clerk_id = $request->header('Clerk-Id');
            $tank = Tank::where('clerk_id', $clerk_id)
                ->where('tank_ulid', $request->tank_ulid)
                ->firstOrFail();

            $validated = $request->validate([
                'name' => 'string|sometimes|min:1|max:64',
                'description' => 'string|sometimes|nullable|max:256'
            ]);

            if (array_key_exists('name', $validated)) {
                $tank->tank_name = $validated['name'];
            }

            if (array_key_exists('description', $validated)) {
                if (is_null($validated['description'])) {
                    $tank->tank_description = "";
                } else {
                    $tank->tank_description = $validated['description'];
                }
            }

            $tank->save();

            return ApiResponse::response(TankResource::make($tank));
        } catch (ModelNotFoundException $e) {
            $message = "No tank found with that ULID.";
            return ApiResponse::response([], 404, $message);
            // return response()->json($message, 404);
        } catch (Exception $e) {
            return ApiResponse::response([], 400, $e->getMessage());
            // return response()->json([$e->getMessage()], 400);
        }
    }

    public function delete(Request $request)
    {
        try {
            $clerk_id = $request->header('Clerk-Id');
            $tank = Tank::where('clerk_id', $clerk_id)
                ->where('tank_ulid', $request->tank_ulid)
                ->firstOrFail();

            $tank->delete();

            $success_message = 'Tank ' . $request->tank_ulid . ' successfully deleted.';

            return ApiResponse::response(null, 200, $success_message);
        } catch (ModelNotFoundException $e) {
            $message = "No tank found with that ULID.";
            return ApiResponse::response(null, 404, $message);
        } catch (Exception $e) {
            return ApiResponse::response(null, 500, $e->getMessage());
        }
    }
}
