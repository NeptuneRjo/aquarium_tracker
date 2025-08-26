<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\Request;

class NoUserIdException extends Exception
{
    public function render(Request $request)
    {
        //
    }
}
