<?php

namespace App\Http\Controllers;

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

            return response()
                ->json(TankListResource::collection($tanks), 200);
        } catch (Exception $e) {
            return response()->json([$e->getMessage()], 400);
        }
    }

    public function show(Request $request)
    {
        try {
            $clerk_id = $request->header('Clerk-Id');
            $tank = Tank::where('clerk_id', $clerk_id)
                ->where('tank_ulid', $request->tank_ulid)
                ->firstOrFail();

            return response()
                ->json(TankResource::make($tank), 200);
        } catch (ModelNotFoundException $e) {
            $message = "No tank found with that ULID.";
            return response()->json($message, 404);
        } catch (Exception $e) {
            return response()->json([$e->getMessage()], 400);
        }
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

            return response()
                ->json(TankResource::make($tank), 200);
        } catch (ValidationException $e) {
            return response()->json([$e->getMessage()], 400);
        } catch (Exception $e) {
            return response()->json([$e->getMessage()], 400);
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

            return response()
                ->json(TankResource::make($tank), 200);
        } catch (ModelNotFoundException $e) {
            $message = "No tank found with that ULID.";
            return response()->json($message, 404);
        } catch (Exception $e) {
            return response()->json([$e->getMessage()], 400);
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

            return response()
                ->json(['message' => $success_message], 200);
        } catch (ModelNotFoundException $e) {
            $message = "No tank found with that ULID.";
            return response()->json($message, 404);
        } catch (Exception $e) {
            return response()->json([$e->getMessage()], 400);
        }
    }
}
