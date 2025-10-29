<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureProfileComplete
{
    /**
     * Handle an incoming request.
     * 
     * Ensures the user has completed their profile setup before accessing certain features.
     * - Drivers need basic profile info (optional, can access most features)
     * - Experts MUST complete full business profile before receiving leads
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // If user is not authenticated, let other middleware handle it
        if (!$user) {
            return $next($request);
        }

        // Check if expert and profile incomplete
        if ($user->user_type === 'expert') {
            $expertProfile = $user->expertProfile;

            // If no expert profile exists OR profile not completed
            if (!$expertProfile || !$expertProfile->profile_completed) {
                // Allow access to onboarding routes
                if (
                    $request->routeIs('expert.onboarding.*') ||
                    $request->routeIs('profile.*') ||
                    $request->routeIs('logout')
                ) {
                    return $next($request);
                }

                // Redirect to onboarding
                return redirect()->route('expert.onboarding.index')
                    ->with('warning', 'Please complete your profile to access this feature.');
            }
        }

        // Check if driver and wants to complete profile (optional)
        if ($user->user_type === 'driver') {
            // Drivers don't have required profile completion
            // But we can check if they want to set up their profile
            // For now, allow all access
        }

        return $next($request);
    }
}
