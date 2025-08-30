<?php

namespace App\Http\Controllers;

use App\Models\Param;
use Exception;
use Illuminate\Http\Request;
use App\Http\Resources\ParamResource;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Models\Tank;

class ParamController extends Controller
{
    public function show(Request $request)
    {
        try {
            $clerk_id = $request->header('Clerk-Id');
            $param = Param::where('clerk_id', $clerk_id)
                ->where('param_ulid', $request->param_ulid)
                ->first();

            return response()->json(ParamResource::make($param), 200);
        } catch (ModelNotFoundException $e) {
            $message = "No param found with that ULID.";
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
                'name' => 'required|string|min:1|max:32',
                'unit' => 'required|string|min:1|max:16',
                'tank_ulid' => 'required|string|max:26'
            ]);

            $tank = Tank::where('clerk_id', $clerk_id)
                ->where('tank_ulid', $validated['tank_ulid'])->firstOrFail();
            $param = $tank->params()->create([
                'param_name' => $validated['name'],
                'param_unit' => $validated['unit'],
                'clerk_id' => $clerk_id
            ]);

            return response()
                ->json(ParamResource::make($param), 200);
        } catch (ModelNotFoundException $e) {
            $message = "No tank found with that ULID.";
            return response()->json($message, 404);
        } catch (Exception $e) {
            // echo $e->getMessage();
            return response()->json([$e->getMessage()], 400);
        }
    }

    public function edit(Request $request)
    {
        try {
            $clerk_id = $request->header('Clerk-Id');
            $param = Param::where('clerk_id', $clerk_id)
                ->where('param_ulid', $request->param_ulid)
                ->firstOrFail();

            $validated = $request->validate([
                'name' => 'sometimes|string|min:1|max:32',
                'unit' => 'sometimes|string|min:1|max:16',
            ]);

            if (array_key_exists('name', $validated)) {
                $param->param_name = $validated['name'];
            }

            if (array_key_exists('unit', $validated)) {
                $param->param_unit = $validated['unit'];
            }

            $param->save();

            return response()
                ->json(ParamResource::make($param), 200);
        } catch (ModelNotFoundException $e) {
            $message = "No param found with that ULID.";
            return response()->json($message, 404);
        } catch (Exception $e) {
            echo $e->getMessage();
            return response()->json([$e->getMessage()], 400);
        }
    }

    public function delete(Request $request)
    {
        try {
            $clerk_id = $request->header('Clerk-Id');
            $param = Param::where('clerk_id', $clerk_id)
                ->where('param_ulid', $request->param_ulid)
                ->firstOrFail();

            $param->delete();

            $success_message = 'Param ' . $request->param_ulid . ' successfully deleted.';

            return response()
                ->json(['message' => $success_message], 200);
        } catch (ModelNotFoundException $e) {
            $message = "No param found with that ULID.";
            return response()->json($message, 404);
        } catch (Exception $e) {
            echo $e->getMessage();
            return response()->json([$e->getMessage()], 400);
        }
    }
}
