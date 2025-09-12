<?php

namespace App\Helpers;

class ApiResponse
{
    public static function response($data, int $status = 200, string $message = '')
    {
        return response()->json([
            'status' => $status,
            'message' => $message,
            'data' => $data
        ], $status);
    }
}
