<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class CheckUserType
{
    public function handle($request, Closure $next, ...$types)
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        if (!in_array(Auth::user()->type, $types)) {
            return redirect()->route('dashboard')->with('error', 'Unauthorized access!');
        }

        return $next($request);
    }
}
