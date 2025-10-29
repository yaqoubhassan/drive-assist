<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Display the email verification prompt.
     * 
     * If user has already verified their email, redirect them to the appropriate
     * dashboard based on their user type. Otherwise, show the verification prompt page.
     */
    public function __invoke(Request $request): RedirectResponse|Response
    {
        // If email already verified, redirect based on user type
        if ($request->user()->hasVerifiedEmail()) {
            return $this->redirectBasedOnUserType($request->user());
        }

        // Email not verified, show verification prompt
        return Inertia::render('Auth/VerifyEmail', [
            'status' => session('status')
        ]);
    }

    /**
     * Redirect user to appropriate destination based on their user type
     */
    protected function redirectBasedOnUserType($user): RedirectResponse
    {
        // For experts, check if they've completed their profile
        if ($user->user_type === 'expert') {
            $expertProfile = $user->expertProfile;

            // If no profile or incomplete, go to onboarding
            if (!$expertProfile || !$expertProfile->profile_completed) {
                return redirect()->route('expert.onboarding.index')
                    ->with('info', 'Please complete your business profile to start receiving leads.');
            }

            // Profile complete, go to expert dashboard
            return redirect()->intended(route('expert.dashboard'));
        }

        // For drivers, redirect to driver dashboard
        if ($user->user_type === 'driver') {
            return redirect()->intended(route('driver.dashboard'));
        }

        // For admin or any other user type, redirect to general dashboard
        return redirect()->intended(route('dashboard'));
    }
}
