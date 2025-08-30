<?php

namespace App\Http\Controllers;

use App\Models\ParamNodes;
use Illuminate\Http\Request;
use App\Http\Resources\ParamNodeResource;
use App\Http\Resources\ParamResource;
use App\Models\Param;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Exception;

class ParamNodeController extends Controller
{
    public function store(Request $request)
    {
        try {
            $clerk_id = $request->header('Clerk-Id');
            $validated = $request->validate([
                'value' => 'required|decimal:0,2',
                'param_ulid' => 'required|string|max:26',
            ]);

            $param = Param::where('clerk_id', $clerk_id)
                ->where('param_ulid', $validated['param_ulid'])
                ->firstOrFail();
            $param_node = $param->param_nodes()->create([
                'param_value' => $validated['value'],
                'clerk_id' => $clerk_id
            ]);

            return response()
                ->json(ParamResource::make($param), 200);
        } catch (ModelNotFoundException $e) {
            $message = "No param found with that ULID.";
            return response()->json($message, 404);
        } catch (ValidationException $e) {
            echo $e->getMessage();
            return response()->json([$e->getMessage()], 400);
        } catch (Exception $e) {
            echo $e->getMessage();
            return response()->json([$e->getMessage()], 400);
        }
    }

    public function edit(Request $request)
    {
        try {
            $clerk_id = $request->header('Clerk-Id');
            $param_node = ParamNodes::with('param')->where('clerk_id', $clerk_id)
                ->where('param_node_ulid', $request->param_node_ulid)
                ->firstOrFail();

            $validated = $request->validate([
                'value' => 'required|decimal:0,2',
            ]);

            $param_node->param_value = $validated['value'];

            $param_node->save();

            return response()
                ->json(ParamResource::make($param_node->param), 200);
        } catch (ModelNotFoundException $e) {
            $message = "No node found with that ULID.";
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
            $param_node = ParamNodes::where('clerk_id', $clerk_id)
                ->where('param_node_ulid', $request->param_node_ulid)
                ->firstOrFail();

            $param_node->delete();

            $success_message = 'Node ' . $request->param_node_ulid . ' successfully deleted.';

            return response()
                ->json(['message' => $success_message], 200);
        } catch (ModelNotFoundException $e) {
            $message = "No node found with that ULID.";
            return response()->json($message, 404);
        } catch (Exception $e) {
            echo $e->getMessage();
            return response()->json([$e->getMessage()], 400);
        }
    }
}
