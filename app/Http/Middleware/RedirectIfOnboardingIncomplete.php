<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfOnboardingIncomplete
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Only apply to authenticated expert users
        if ($user && $user->user_type === 'expert') {
            $expertProfile = $user->expertProfile;

            // If expert profile exists but is not completed
            if ($expertProfile && !$expertProfile->profile_completed) {
                // Don't redirect if already on onboarding pages or logout
                $currentRoute = $request->route()->getName();
                $allowedRoutes = [
                    'expert.onboarding.index',
                    'expert.onboarding.save',
                    'expert.onboarding.complete',
                    'logout',
                ];

                if (!in_array($currentRoute, $allowedRoutes)) {
                    return redirect()->route('expert.onboarding.index')
                        ->with('info', 'Please complete your profile to access the dashboard.');
                }
            }
        }

        return $next($request);
    }
}
