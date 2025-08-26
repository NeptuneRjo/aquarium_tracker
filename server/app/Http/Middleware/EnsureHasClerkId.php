<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Exceptions\NoUserIdException;

class EnsureHasClerkId
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $clerk_id = $request->hasHeader('Clerk-Id');

        if (!$clerk_id) {
            return response()->json([
                'error' => 'true',
                'message' => 'The header \'Clerk-Id\' was not provided.'
            ], 400);
        }

        return $next($request);
    }
}
