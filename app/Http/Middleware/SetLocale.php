<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Set the language for the current request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->cookie('ui_locale', config('app.locale'));
        $fallbackLocale = config('app.locale');

        App::setLocale(
            in_array($locale, ['id', 'en'], true)
                ? $locale
                : (in_array($fallbackLocale, ['id', 'en'], true) ? $fallbackLocale : 'en'),
        );

        return $next($request);
    }
}
