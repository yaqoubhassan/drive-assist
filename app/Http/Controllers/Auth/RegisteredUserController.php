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
     * Simple registration form with name, email, password, and user type selection.
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
     * Creates account with basic info only. Profile completion happens after email verification.
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

        // Create user with basic information only
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'user_type' => $request->user_type,
        ]);

        // Fire the Registered event to send verification email
        event(new Registered($user));

        // Log the user in temporarily to access verification page
        Auth::login($user);

        // Redirect to email verification notice
        // After verification, they'll be redirected to profile completion
        return redirect()->route('verification.notice')
            ->with('success', 'Registration successful! Please verify your email address to continue.');
    }
}
