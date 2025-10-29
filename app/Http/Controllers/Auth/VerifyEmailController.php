<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return $this->redirectBasedOnUserType($request->user());
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        return $this->redirectBasedOnUserType($request->user());
    }

    /**
     * Redirect user to appropriate destination based on their user type and profile status
     */
    protected function redirectBasedOnUserType($user): RedirectResponse
    {
        // For experts, check if they've completed their profile
        if ($user->user_type === 'expert') {
            $expertProfile = $user->expertProfile;

            // If no profile or incomplete, go to onboarding
            if (!$expertProfile || !$expertProfile->profile_completed) {
                return redirect()->route('expert.onboarding.index')
                    ->with('success', 'Email verified! Please complete your business profile to start receiving leads.');
            }

            // Profile complete, go to dashboard
            return redirect()->route('expert.dashboard')
                ->with('success', 'Welcome back!');
        }

        // For drivers, can optionally complete profile
        if ($user->user_type === 'driver') {
            // Check if they have any vehicles or basic info
            // For now, just send them to dashboard
            return redirect()->route('driver.dashboard')
                ->with('success', 'Email verified! Welcome to DriveAssist.');
        }

        // Admin or other user types
        return redirect()->route('dashboard')
            ->with('success', 'Email verified successfully!');
    }
}
