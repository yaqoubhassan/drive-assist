<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     * 
     * This shows the user type selection page.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register', [
            'userTypes' => [
                'driver' => [
                    'title' => "I'm a Driver",
                    'description' => 'Looking for help with my vehicle',
                    'features' => [
                        'AI-powered diagnostics',
                        'Connect with local experts',
                        'Track your vehicle maintenance',
                        'Save diagnosis history',
                    ],
                    'icon' => 'car',
                ],
                'expert' => [
                    'title' => "I'm an Expert",
                    'description' => 'I provide automotive services',
                    'features' => [
                        'Get qualified leads',
                        'Manage your business',
                        'Build your reputation',
                        'Flexible schedule',
                    ],
                    'icon' => 'wrench',
                ],
            ],
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'user_type' => 'required|in:driver,expert',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'user_type' => $request->user_type,
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Redirect based on user type
        if ($user->user_type === 'expert') {
            // Experts need to complete onboarding
            return redirect()->route('expert.onboarding')->with('success', 'Welcome! Please complete your expert profile to start receiving leads.');
        }

        // Drivers go straight to dashboard
        return redirect()->route('driver.dashboard')->with('success', 'Welcome to DriveAssist! Start by diagnosing your first vehicle issue.');
    }
}
